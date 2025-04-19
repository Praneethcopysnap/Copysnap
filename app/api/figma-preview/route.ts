import { NextResponse } from 'next/server';

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';

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
    // Check for dev mode
    const devMode = searchParams.get('devMode') === 'true';
    
    console.log('Figma preview request received:', { fileKey, nodeId, devMode });
    
    if (!fileKey || fileKey.trim() === '') {
      console.error('Missing or empty fileKey parameter');
      return NextResponse.json(
        { error: 'Missing or invalid fileKey parameter' },
        { status: 400 }
      );
    }
    
    // Sanitize the file key to ensure it only contains valid characters
    // Figma file keys should only contain letters, numbers, hyphens, and underscores
    const sanitizedFileKey = fileKey.replace(/[^a-zA-Z0-9_-]/g, '');
    
    // Log if we had to sanitize the key
    if (sanitizedFileKey !== fileKey) {
      console.log(`Sanitized file key from "${fileKey}" to "${sanitizedFileKey}"`);
    }
    
    // For development, return mock data
    if (devMode) {
      console.log('Using dev mode for Figma preview');
      return NextResponse.json({
        image: 'https://placehold.co/600x400/EAEAEA/7D30DD?text=Figma+Preview+(Dev+Mode)',
        file: {
          name: 'Mock Figma File',
          key: sanitizedFileKey,
          lastModified: new Date().toISOString()
        },
        node: {
          id: nodeId || 'mock-node-id',
          name: 'Mock Frame',
          type: 'FRAME'
        },
        dev: true
      });
    }
    
    if (!FIGMA_API_TOKEN) {
      console.error('Figma API token not configured');
      return NextResponse.json(
        { error: 'Figma API token is not configured', requiresConfig: true },
        { status: 401 }
      );
    }
    
    console.log('Fetching Figma preview for file:', sanitizedFileKey, nodeId ? `with node: ${nodeId}` : 'without specific node');
    
    // First try to access the file directly through the thumbnail API as a fast way to check if it exists
    try {
      console.log(`Attempting thumbnail check with: https://www.figma.com/file/${sanitizedFileKey}/thumbnail`);
      const thumbnailResponse = await fetch(`https://www.figma.com/file/${sanitizedFileKey}/thumbnail`, {
        method: 'HEAD'
      });
      
      if (!thumbnailResponse.ok) {
        console.warn(`Thumbnail check failed with status ${thumbnailResponse.status}`);
      } else {
        console.log('Thumbnail check succeeded, file appears to exist');
      }
    } catch (thumbnailError) {
      console.warn('Thumbnail check error (non-fatal):', thumbnailError);
      // Continue anyway, this is just a pre-check
    }
    
    // Now check if the file is accessible through the Figma API
    try {
      // Try to access basic file information to verify permissions
      console.log(`Checking file access: https://api.figma.com/v1/files/${sanitizedFileKey}/metadata`);
      const checkResponse = await fetch(`https://api.figma.com/v1/files/${sanitizedFileKey}/metadata`, {
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
            { 
              error: 'Figma file not found. Please check the link and ensure the file exists.',
              details: 'The provided file key does not match any existing Figma file or you do not have access to it.',
              fileKey: sanitizedFileKey
            },
            { status: 404 }
          );
        } else if (checkResponse.status === 403) {
          return NextResponse.json(
            { 
              error: 'Access denied. Make sure the Figma file is shared with the correct permissions and your API token is valid.',
              details: 'The file exists but you do not have permission to access it. Try sharing the file publicly or check your API token.',
              fileKey: sanitizedFileKey
            },
            { status: 403 }
          );
        } else if (checkResponse.status === 429) {
          return NextResponse.json(
            { 
              error: 'Figma API rate limit exceeded. Please try again later.',
              details: 'Too many requests were made to the Figma API in a short period of time.',
              fileKey: sanitizedFileKey
            },
            { status: 429 }
          );
        } else {
          return NextResponse.json(
            { 
              error: 'Could not access Figma file', 
              details: errorData,
              fileKey: sanitizedFileKey
            },
            { status: checkResponse.status || 500 }
          );
        }
      }
      
      console.log('File access check passed - file is accessible');
    } catch (error) {
      console.error('Error checking file access:', error);
      return NextResponse.json(
        { 
          error: 'Failed to check file access', 
          details: String(error),
          fileKey: sanitizedFileKey
        },
        { status: 500 }
      );
    }
    
    // If no specific node ID is provided, get the file to find the first node
    if (!nodeId) {
      try {
        // First try to get a thumbnail directly as a fallback
        const fallbackThumbnail = `https://www.figma.com/file/${sanitizedFileKey}/thumbnail`;
        
        // Fetch the file metadata to find suitable frames
        console.log(`Making Figma API request to: https://api.figma.com/v1/files/${sanitizedFileKey}`);
        const fileResponse = await fetch(`https://api.figma.com/v1/files/${sanitizedFileKey}`, {
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
            // Return fallback thumbnail even if file metadata is not accessible
            console.log('Returning fallback thumbnail due to 404 on file data');
            return NextResponse.json({ 
              imageUrl: fallbackThumbnail,
              warning: 'File metadata not accessible, using fallback thumbnail',
              success: true 
            });
          } else if (fileResponse.status === 403) {
            // Return fallback thumbnail even if file metadata is not accessible
            console.log('Returning fallback thumbnail due to 403 on file data');
            return NextResponse.json({ 
              imageUrl: fallbackThumbnail,
              warning: 'Access denied to file metadata, using fallback thumbnail',
              success: true 
            });
          } else {
            // Return fallback thumbnail even if file metadata is not accessible
            console.log('Returning fallback thumbnail due to API error');
            return NextResponse.json({ 
              imageUrl: fallbackThumbnail,
              warning: 'File metadata not accessible, using fallback thumbnail',
              success: true 
            });
          }
        }
        
        const fileData = await fileResponse.json();
        console.log('Figma file data received:', fileData.name ? `File: ${fileData.name}` : 'Unknown file');
        
        // Check if we have access to the document structure
        if (!fileData.document || !fileData.document.children) {
          console.error('Invalid Figma document structure or no access to document details');
          // Return fallback thumbnail
          return NextResponse.json({ 
            imageUrl: fallbackThumbnail,
            file: {
              name: fileData.name || 'Figma File', 
              key: sanitizedFileKey
            },
            warning: 'Document structure not accessible',
            success: true 
          });
        }
        
        if (!fileData.document.children.length) {
          console.error('Document has no pages');
          // Return fallback thumbnail
          return NextResponse.json({ 
            imageUrl: fallbackThumbnail,
            file: {
              name: fileData.name || 'Figma File', 
              key: sanitizedFileKey
            },
            warning: 'Document has no pages',
            success: true 
          });
        }
        
        // Find the first page with actual content
        const document = fileData.document;
        const firstPage = document.children.find(page => 
          page.children && page.children.length > 0
        );
        
        if (!firstPage || !firstPage.children || !firstPage.children.length) {
          console.error('No pages with content found in Figma file');
          // Return fallback thumbnail
          return NextResponse.json({ 
            imageUrl: fallbackThumbnail,
            file: {
              name: fileData.name || 'Figma File', 
              key: sanitizedFileKey
            },
            warning: 'No content found in file',
            success: true 
          });
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
            return await getImageForNode(sanitizedFileKey, fallbackNode.id);
          }
          
          console.error('No suitable content found in the Figma file');
          // Return fallback thumbnail
          return NextResponse.json({ 
            imageUrl: fallbackThumbnail,
            file: {
              name: fileData.name || 'Figma File', 
              key: sanitizedFileKey
            },
            warning: 'No suitable frames found in file',
            success: true 
          });
        }
        
        // Use the found node ID
        const targetNodeId = firstNode.id;
        console.log('Found suitable node:', firstNode.type, targetNodeId);
        
        return await getImageForNode(sanitizedFileKey, targetNodeId);
      } catch (error) {
        console.error('Error processing Figma file data:', error);
        // Try to get an image of the entire file as a fallback
        return await getImageForFileNoNode(sanitizedFileKey);
      }
    } else {
      // If a specific node ID was provided, get that directly
      return await getImageForNode(sanitizedFileKey, nodeId);
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
    
    // First try thumbnail URL as a reliable fallback
    const thumbnailUrl = `https://www.figma.com/file/${fileKey}/thumbnail`;
    
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
      console.log('Using thumbnail URL as fallback');
      
      // Always return the thumbnail URL as fallback
      return NextResponse.json({ 
        imageUrl: thumbnailUrl,
        warning: 'Could not generate file image, using thumbnail instead',
        success: true,
        fileKey
      });
    }
    
    const imageData = await imageResponse.json();
    if (imageData.images && Object.values(imageData.images).length > 0) {
      const imageUrl = Object.values(imageData.images)[0] as string;
      console.log('Successfully got full file image');
      return NextResponse.json({ 
        imageUrl,
        success: true,
        fileKey
      });
    } else {
      console.error('No image returned for full file');
      return NextResponse.json({ 
        imageUrl: thumbnailUrl,
        warning: 'API returned no images, using thumbnail instead',
        success: true,
        fileKey
      });
    }
  } catch (error) {
    console.error('Error in getImageForFileNoNode:', error);
    // Return thumbnail as ultimate fallback
    return NextResponse.json({ 
      imageUrl: `https://www.figma.com/file/${fileKey}/thumbnail`,
      warning: 'Error fetching file image, using thumbnail instead',
      success: true,
      fileKey
    });
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
      
      // Return thumbnail as fallback
      return NextResponse.json({ 
        imageUrl: `https://www.figma.com/file/${fileKey}/thumbnail`,
        warning: 'Could not get node image, using thumbnail instead',
        success: true,
        fileKey,
        nodeId: cleanNodeId
      });
    }
    
    const imageData = await imageResponse.json();
    const imageUrl = imageData.images && imageData.images[cleanNodeId];
    
    if (!imageUrl) {
      console.error('No image URL returned for node:', cleanNodeId);
      // Try to get a thumbnail of the file
      try {
        console.log('Attempting to get file thumbnail as fallback');
        return NextResponse.json({ 
          imageUrl: `https://www.figma.com/file/${fileKey}/thumbnail`,
          nodeId: 'thumbnail',
          warning: 'No image available for specified node, using thumbnail instead',
          success: true,
          fileKey
        });
      } catch (thumbnailError) {
        console.error('Error getting thumbnail:', thumbnailError);
        return NextResponse.json(
          { 
            error: 'No preview available for this Figma file. Try using a direct file link.',
            fileKey 
          },
          { status: 404 }
        );
      }
    }
    
    console.log('Successfully fetched image URL for node:', cleanNodeId);
    return NextResponse.json({ 
      imageUrl,
      nodeId: cleanNodeId,
      success: true,
      fileKey
    });
  } catch (error) {
    console.error('Error in getImageForNode:', error);
    // Return thumbnail as ultimate fallback
    return NextResponse.json({ 
      imageUrl: `https://www.figma.com/file/${fileKey}/thumbnail`,
      warning: 'Error fetching node image, using thumbnail instead',
      success: true,
      fileKey
    });
  }
} 