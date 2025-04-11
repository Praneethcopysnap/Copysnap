// This is the main entry point for the Figma plugin
// It handles communication between Figma and the UI

// Keep track of the logged in user
let currentUser: any = null;
let isAuthenticated = false;

// Show the UI when the plugin starts
figma.showUI(__html__, { width: 350, height: 450 });
console.log('Plugin started, UI shown');

// Function to extract text and metadata from selected frames
function extractFrameData(node: SceneNode) {
  // Basic data about the node
  const data: any = {
    id: node.id,
    name: node.name,
    type: node.type,
    children: []
  };
  
  // If the node has text, extract it
  if ('characters' in node) {
    data.text = node.characters;
  }
  
  // If this is a frame or group with children, process them recursively
  if ('children' in node) {
    for (const child of node.children) {
      data.children.push(extractFrameData(child));
    }
  }
  
  return data;
}

// Function to show the main plugin UI after authentication
function showPluginUI() {
  // Resize the UI for the main plugin interface
  figma.ui.resize(350, 500);
  
  // Load the main UI file instead of redirecting
  figma.ui.postMessage({ 
    type: 'show-plugin-ui',
    user: currentUser
  });
}

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  console.log('Message received from UI:', msg);
  
  if (msg.type === 'login-success') {
    console.log('Login successful:', msg.user);
    figma.notify(`Logged in as ${msg.user.name}`, {timeout: 2000});
    
    // Store the user information
    currentUser = msg.user;
    isAuthenticated = true;
    
    // Show main plugin UI
    showPluginUI();
  }
  else if (msg.type === 'generate-copy') {
    console.log('Processing generate-copy command');
    
    // Check if there's a selection
    if (figma.currentPage.selection.length === 0) {
      console.log('No selection found, sending error message');
      figma.ui.postMessage({ 
        type: 'error', 
        message: 'Please select a frame or component to generate copy for.' 
      });
      // Show a Figma notification too
      figma.notify('Please select a frame or component first', {timeout: 2000});
      return;
    }
    
    // Get the selected node
    const selectedNode = figma.currentPage.selection[0];
    console.log('Selected node:', selectedNode.name, selectedNode.type);
    
    try {
      // Extract data from the selection
      const frameData = extractFrameData(selectedNode);
      console.log('Extracted frame data:', frameData);
      
      // Send the data to the UI
      figma.ui.postMessage({ 
        type: 'selection-data', 
        data: frameData 
      });
      console.log('Sent selection data to UI');
    } catch (error) {
      console.error('Error extracting or sending data:', error);
      figma.notify('Error processing selection: ' + error, {timeout: 3000});
    }
  } 
  else if (msg.type === 'close') {
    figma.closePlugin();
  }
}; 