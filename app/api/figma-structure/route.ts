import { NextResponse, NextRequest } from 'next/server';

// Figma API access token from environment variables
const FIGMA_API_TOKEN = process.env.FIGMA_API_TOKEN || '';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the fileKey from query parameters
    const fileKey = request.nextUrl.searchParams.get('fileKey');
    
    if (!fileKey) {
      console.error('Missing fileKey parameter');
      return NextResponse.json(
        { error: 'Missing fileKey parameter' },
        { status: 400 }
      );
    }
    
    if (!FIGMA_API_TOKEN) {
      console.error('Missing Figma API token in environment variables');
      return NextResponse.json(
        { error: 'API configuration error. Contact the administrator.' },
        { status: 500 }
      );
    }
    
    console.log('Fetching Figma structure for file:', fileKey);
    
    // Fetch the file data from Figma API
    const fileResponse = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': FIGMA_API_TOKEN
      },
      // Avoid caching issues
      cache: 'no-store'
    });
    
    if (!fileResponse.ok) {
      let errorData;
      try {
        errorData = await fileResponse.json();
      } catch (e) {
        errorData = { status: fileResponse.status, statusText: fileResponse.statusText };
      }
      
      console.error('Figma file fetch error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch Figma file', details: errorData },
        { status: fileResponse.status || 500 }
      );
    }
    
    const fileData = await fileResponse.json();
    console.log('Figma file data received:', fileData.name ? `File: ${fileData.name}` : 'Unknown file');
    
    if (!fileData.document || !fileData.document.children) {
      console.error('Invalid Figma document structure or no access');
      return NextResponse.json(
        { error: 'Invalid Figma document structure or no access' },
        { status: 404 }
      );
    }
    
    // Process the document to extract pages and frames
    const pages: Record<string, any[]> = {};
    const timestamp = new Date().toISOString();
    const allFrameIds: string[] = [];
    
    // Process each page in the document
    for (const page of fileData.document.children) {
      if (page.type !== 'CANVAS') continue;
      
      const pageName = page.name;
      const frames: any[] = [];
      
      // Function to recursively process nodes to find frames
      const processNode = (node: any) => {
        // Include FRAME, COMPONENT, COMPONENT_SET, SECTION, or GROUP nodes
        if (['FRAME', 'COMPONENT', 'COMPONENT_SET', 'SECTION', 'GROUP'].includes(node.type)) {
          frames.push({
            name: node.name,
            frameId: node.id,
            syncedAt: timestamp,
            status: 'Needs Copy',
            tags: [],
            type: node.type
          });
          allFrameIds.push(node.id);
        }
        
        // Recursively process children
        if (node.children && node.children.length > 0) {
          for (const child of node.children) {
            processNode(child);
          }
        }
      };
      
      // Process each frame in the page
      if (page.children && page.children.length > 0) {
        for (const frame of page.children) {
          processNode(frame);
        }
      }
      
      if (frames.length > 0) {
        pages[pageName] = frames;
      }
    }
    
    // Now fetch image URLs for all frames
    if (allFrameIds.length > 0) {
      // Split into batches if needed (Figma API has limits)
      const batchSize = 25;
      const batches: string[][] = [];
      
      for (let i = 0; i < allFrameIds.length; i += batchSize) {
        batches.push(allFrameIds.slice(i, i + batchSize));
      }
      
      // Process each batch
      for (const batch of batches) {
        const batchIds = batch.join(',');
        
        try {
          const imagesResponse = await fetch(
            `https://api.figma.com/v1/images/${fileKey}?ids=${batchIds}&format=png&scale=2`,
            {
              headers: {
                'X-Figma-Token': FIGMA_API_TOKEN
              },
              cache: 'no-store'
            }
          );
          
          if (!imagesResponse.ok) {
            console.error('Failed to fetch images for batch:', batch);
            continue; // Continue with other batches
          }
          
          const imagesData = await imagesResponse.json();
          
          // Add image URLs to frames
          if (imagesData.images) {
            for (const pageName in pages) {
              if (Object.prototype.hasOwnProperty.call(pages, pageName)) {
                const pageFrames = pages[pageName] || [];
                for (const frame of pageFrames) {
                  if (imagesData.images[frame.frameId]) {
                    frame.imageUrl = imagesData.images[frame.frameId];
                  } else {
                    // Use thumbnail fallback
                    frame.imageUrl = `https://www.figma.com/file/${fileKey}/thumbnail`;
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching images for batch:', error);
          // Continue with other batches
        }
      }
    }
    
    console.log(`Found ${allFrameIds.length} frames across ${Object.keys(pages).length} pages`);
    
    // Return the structured data
    return NextResponse.json({
      fileId: fileKey,
      fileName: fileData.name,
      lastModified: fileData.lastModified,
      pages: pages,
      totalScreens: allFrameIds.length
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
    
  } catch (error) {
    console.error('Error in Figma structure API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 