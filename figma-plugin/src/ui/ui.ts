// This file handles the UI logic for the plugin

console.log('UI script loaded');

// Add event listeners after the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, setting up event handlers');
  
  // Close button handler
  const closeBtn = document.getElementById('closeBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      console.log('Close button clicked');
      parent.postMessage({
        pluginMessage: { type: 'close' }
      }, '*');
    });
  }
  
  // Emergency button handler
  const emergencyBtn = document.getElementById('emergencyBtn');
  if (emergencyBtn) {
    emergencyBtn.addEventListener('click', () => {
      console.log('Emergency button clicked');
      
      const examples = [
        "Button copy in a professional tone: 'Complete Purchase'",
        "Button copy in a professional tone: 'Proceed to Checkout'",
        "Button copy in a professional tone: 'Confirm Order'"
      ];
      
      // Display using alert which is guaranteed to work
      alert("GENERATED COPY EXAMPLES:\n\n" + examples.join("\n\n"));
    });
  }
});

// Handle messages from the plugin code
window.onmessage = (event) => {
  console.log('Message received from UI:', event.data.pluginMessage);
  const message = event.data.pluginMessage;
  
  if (!message) return;
  
  const status = document.getElementById('status');
  if (!status) {
    console.error('Status element not found');
    return;
  }
  
  switch (message.type) {
    case 'selection-data':
      console.log('Received selection data:', message.data);
      status.innerHTML = `<strong>Selected:</strong> ${message.data.name} (${message.data.type})`;
      
      // Generate mock suggestions after a short delay
      setTimeout(() => {
        const suggestions = [
          "Button copy in a professional tone: 'Complete Purchase'",
          "Button copy in a professional tone: 'Proceed to Checkout'",
          "Button copy in a professional tone: 'Confirm Order'"
        ];
        
        // Display using alert which is guaranteed to work
        alert("GENERATED COPY SUGGESTIONS:\n\n" + suggestions.join("\n\n"));
      }, 1000);
      break;
      
    case 'error':
      console.log('Received error:', message.message);
      status.innerHTML = `<strong>Error:</strong> ${message.message}`;
      status.style.color = 'red';
      break;
  }
}; 