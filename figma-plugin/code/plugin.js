// This is the code that runs in the Figma environment

// Show the UI
figma.showUI(__html__, { width: 400, height: 600 });

// Check for selected text nodes
function checkSelection() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.ui.postMessage({ 
      type: 'no-selection',
      message: 'Please select a text element to generate copy suggestions.'
    });
    return;
  }
  
  // Filter for text nodes
  const textNodes = selection.filter(node => node.type === 'TEXT');
  
  if (textNodes.length === 0) {
    figma.ui.postMessage({ 
      type: 'no-text-nodes',
      message: 'Please select a text element to generate copy suggestions.'
    });
    return;
  }
  
  // Get the first selected text node
  const selectedNode = textNodes[0];
  
  // Get surrounding context
  const parent = selectedNode.parent;
  const siblings = parent ? parent.children : [];
  const nodeType = getNodeType(selectedNode, siblings);
  
  // Send data to UI
  figma.ui.postMessage({
    type: 'selection',
    data: {
      id: selectedNode.id,
      text: selectedNode.characters,
      nodeType: nodeType,
      fontName: selectedNode.fontName,
      fontSize: selectedNode.fontSize,
      textCase: selectedNode.textCase,
      fills: selectedNode.fills,
    }
  });
}

// Try to determine the type of node based on context
function getNodeType(node, siblings) {
  // Check if it's a button by looking at the parent component
  if (node.parent && node.parent.type === 'INSTANCE') {
    if (node.parent.name.toLowerCase().includes('button')) {
      return 'Button';
    }
  }
  
  // Check text characteristics
  const text = node.characters.toLowerCase();
  const fontSize = node.fontSize;
  
  // Check for headings
  if (typeof fontSize === 'number' && fontSize >= 24) {
    return 'Heading';
  }
  
  // Check for common UI patterns in text
  if (text.includes('sign up') || text.includes('login') || 
      text.includes('submit') || text.includes('continue')) {
    return 'CTA Button';
  }
  
  if (text.includes('error') || text.startsWith('please') || 
      text.includes('invalid') || text.includes('required')) {
    return 'Error Message';
  }
  
  if (text.includes('success') || text.includes('thank you') || 
      text.includes('complete') || text.includes('confirm')) {
    return 'Success Message';
  }
  
  if (text.endsWith('?')) {
    return 'Question or Label';
  }
  
  // Default
  return 'Text Element';
}

// Handle messages from the UI
figma.ui.onmessage = msg => {
  if (msg.type === 'apply-text') {
    // Find node by ID and update its text
    const node = figma.getNodeById(msg.nodeId);
    
    if (node && node.type === 'TEXT') {
      node.characters = msg.text;
      figma.notify('Text updated!');
    } else {
      figma.notify('Error: Could not find text element', { error: true });
    }
  }
  
  if (msg.type === 'refresh-selection') {
    checkSelection();
  }
  
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

// Run initially
checkSelection();

// Listen for selection changes
figma.on('selectionchange', () => {
  checkSelection();
}); 