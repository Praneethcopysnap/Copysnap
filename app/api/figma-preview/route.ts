import { NextResponse } from 'next/server';

// Use environment variable for Figma API token
const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN || '';

// Check if token is available
if (!FIGMA_API_TOKEN) {
  console.warn('FIGMA_API_TOKEN environment variable is not set. Figma previews will not work.');
}

export async function GET(request: Request) {
  try {
    // Get the fileKey and nodeId from query parameters
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('fileKey');
    const nodeId = searchParams.get('nodeId') || '';
    
    if (!fileKey) {
      console.error('Missing fileKey parameter');
      return NextResponse.json(
        { error: 'Missing fileKey parameter' },
        { status: 400 }
      );
    }
    
    console.log('Fetching Figma preview for file:', fileKey, nodeId ? `with node: ${nodeId}` : 'without specific node');
    
    // First check if the file is accessible
    try {
      // Try to access basic file information to verify permissions
      const checkResponse = await fetch(`https://api.figma.com/v1/files/${fileKey}/metadata`, {
        headers: {
          'X-Figma-Token': FIGMA_API_TOKEN
        }
      });
      
      if (!checkResponse.ok) {
        let errorData;
        try {
          errorData = await checkResponse.json();
        } catch (e) {
          errorData = { status: checkResponse.status, statusText: checkResponse.statusText };
        }
        
        console.error('File access check failed:', errorData);
        
        if (checkResponse.status === 404) {
          return NextResponse.json(
            { error: 'Figma file not found. Please check the link and ensure the file is shared properly.' },
            { status: 404 }
          );
        } else if (checkResponse.status === 403) {
          return NextResponse.json(
            { error: 'Access denied. Make sure the Figma file is shared with "Anyone with the link" permission.' },
            { status: 403 }
          );
        } else {
          return NextResponse.json(
            { error: 'Could not access Figma file', details: errorData },
            { status: checkResponse.status || 500 }
          );
        }
      }
      
      console.log('File access check passed - file is accessible');
    } catch (error) {
      console.error('Error checking file access:', error);
      // Continue with the rest of the process even if this check fails
    }
    
    // First, if no specific node ID is provided, get the file to find the first node
    if (!nodeId) {
      try {
        // Fetch the file metadata to find suitable frames
        console.log(`Making Figma API request to: https://api.figma.com/v1/files/${fileKey}`);
        const fileResponse = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
          headers: {
            'X-Figma-Token': FIGMA_API_TOKEN
          }
        });
        
        if (!fileResponse.ok) {
          let errorData;
          try {
            errorData = await fileResponse.json();
          } catch (e) {
            errorData = { status: fileResponse.status, statusText: fileResponse.statusText };
          }
          
          console.error('Figma file fetch error:', errorData);
          if (fileResponse.status === 404) {
            return NextResponse.json(
              { error: 'Figma file not found. The file may have been deleted or the link is incorrect.' },
              { status: 404 }
            );
          } else if (fileResponse.status === 403) {
            return NextResponse.json(
              { error: 'Access denied. Make sure the Figma file is shared with "Anyone with the link" permission.' },
              { status: 403 }
            );
          } else {
            return NextResponse.json(
              { error: 'Failed to fetch Figma file', details: errorData },
              { status: fileResponse.status || 500 }
            );
          }
        }
        
        const fileData = await fileResponse.json();
        console.log('Figma file data received:', fileData.name ? `File: ${fileData.name}` : 'Unknown file');
        
        // Check if we have access to the document structure
        if (!fileData.document || !fileData.document.children) {
          console.error('Invalid Figma document structure or no access to document details');
          // Try to fetch an image directly if document structure isn't available
          return await getImageForFileNoNode(fileKey);
        }
        
        if (!fileData.document.children.length) {
          console.error('Document has no pages');
          return NextResponse.json(
            { error: 'The Figma document has no pages' },
            { status: 404 }
          );
        }
        
        // Find the first page with actual content
        const document = fileData.document;
        const firstPage = document.children.find(page => 
          page.children && page.children.length > 0
        );
        
        if (!firstPage || !firstPage.children || !firstPage.children.length) {
          console.error('No pages with content found in Figma file');
          return NextResponse.json(
            { error: 'No pages with content found in Figma file' },
            { status: 404 }
          );
        }
        
        console.log(`Found page with content: ${firstPage.name || 'Unnamed page'}`);
        
        // Get the first visible node (frame, component, etc.)
        const firstNode = firstPage.children.find(child => 
          ['FRAME', 'COMPONENT', 'COMPONENT_SET', 'CANVAS', 'SECTION', 'GROUP'].includes(child.type)
        );
        
        if (!firstNode) {
          console.log('No standard frame or component found, trying to use any child as fallback');
          // Try to use the first child of any type as fallback
          if (firstPage.children.length > 0) {
            const fallbackNode = firstPage.children[0];
            console.log('Using fallback node:', fallbackNode.type, fallbackNode.id);
            return await getImageForNode(fileKey, fallbackNode.id);
          }
          
          console.error('No suitable content found in the Figma file');
          return NextResponse.json(
            { error: 'No suitable content found in the Figma file' },
            { status: 404 }
          );
        }
        
        // Use the found node ID
        const targetNodeId = firstNode.id;
        console.log('Found suitable node:', firstNode.type, targetNodeId);
        
        return await getImageForNode(fileKey, targetNodeId);
      } catch (error) {
        console.error('Error processing Figma file data:', error);
        // Try to get an image of the entire file as a fallback
        return await getImageForFileNoNode(fileKey);
      }
    } else {
      // If a specific node ID was provided, get that directly
      return await getImageForNode(fileKey, nodeId);
    }
  } catch (error) {
    console.error('Error fetching Figma preview:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

// Last resort - try to get an image of the entire file if we can't access nodes
async function getImageForFileNoNode(fileKey: string) {
  try {
    console.log(`Attempting to get full file image for ${fileKey}`);
    const imageResponse = await fetch(
      `https://api.figma.com/v1/files/${fileKey}/images`, 
      {
        method: 'POST',
        headers: {
          'X-Figma-Token': FIGMA_API_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format: 'png',
          scale: 2
        })
      }
    );
    
    if (!imageResponse.ok) {
      let errorData;
      try {
        errorData = await imageResponse.json();
      } catch (e) {
        errorData = { status: imageResponse.status, statusText: imageResponse.statusText };
      }
      
      console.error('Failed to get file image:', errorData);
      return NextResponse.json(
        { error: 'Failed to get file image', details: errorData },
        { status: imageResponse.status || 500 }
      );
    }
    
    const imageData = await imageResponse.json();
    if (imageData.images && imageData.images[0]) {
      console.log('Successfully got full file image');
      return NextResponse.json({ 
        imageUrl: imageData.images[0],
        success: true 
      });
    } else {
      console.error('No image returned for full file');
      return NextResponse.json(
        { error: 'No image returned for full file' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error in getImageForFileNoNode:', error);
    return NextResponse.json(
      { error: 'Error fetching file image', details: String(error) },
      { status: 500 }
    );
  }
}

// Helper function to get image for a specific node
async function getImageForNode(fileKey: string, nodeId: string) {
  try {
    // Clean up node ID if it contains URL encoding
    const cleanNodeId = nodeId.replace(/%3A/g, ':');
    
    console.log(`Fetching image for node ${cleanNodeId} in file ${fileKey}`);
    
    const imageResponse = await fetch(
      `https://api.figma.com/v1/images/${fileKey}?ids=${cleanNodeId}&format=png&scale=2`, 
      {
        headers: {
          'X-Figma-Token': FIGMA_API_TOKEN
        }
      }
    );
    
    if (!imageResponse.ok) {
      let errorData;
      try {
        errorData = await imageResponse.json();
      } catch (e) {
        errorData = { status: imageResponse.status, statusText: imageResponse.statusText };
      }
      
      console.error('Failed to get image URL:', errorData);
      // If we can't get the specific node, try fetching the entire file image
      if (imageResponse.status === 404) {
        console.log('Node not found, trying to get full file image');
        return await getImageForFileNoNode(fileKey);
      }
      
      return NextResponse.json(
        { error: 'Failed to get image URL', details: errorData },
        { status: imageResponse.status || 500 }
      );
    }
    
    const imageData = await imageResponse.json();
    const imageUrl = imageData.images && imageData.images[cleanNodeId];
    
    if (!imageUrl) {
      console.error('No image URL returned for node:', cleanNodeId);
      // Try to get a thumbnail of the file
      try {
        console.log('Attempting to get file thumbnail as fallback');
        return NextResponse.json({ 
          imageUrl: `https://www.figma.com/thumbnail/${fileKey}`,
          nodeId: 'thumbnail',
          success: true 
        });
      } catch (thumbnailError) {
        console.error('Error getting thumbnail:', thumbnailError);
        return NextResponse.json(
          { error: 'No preview available for this Figma file. Try using a direct file link.' },
          { status: 404 }
        );
      }
    }
    
    console.log('Successfully fetched image URL for node:', cleanNodeId);
    return NextResponse.json({ 
      imageUrl,
      nodeId: cleanNodeId,
      success: true 
    });
  } catch (error) {
    console.error('Error in getImageForNode:', error);
    return NextResponse.json(
      { error: 'Error fetching node image', details: String(error) },
      { status: 500 }
    );
  }
} 