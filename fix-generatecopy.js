const fs = require('fs');
const path = require('path');

const filePath = path.join('app', 'workspaces', '[id]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the generateCopy function at the end of the file and replace it
content = content.replace(/\/\/ Helper function to generate copy using the API[\s\S]*$/, '');

// Add the updated generateCopy function inside the component
// Find a good insertion point after declaration of all state variables
const insertionPoint = content.indexOf('const [generatedSuggestions, setGeneratedSuggestions] = useState([]);');
const insertAfterGeneratedSuggestions = content.indexOf('\n', insertionPoint) + 1;

const newFunction = `
  // Helper function to generate copy using the API
  const generateCopy = async (formData, workspaceId) => {
    try {
      // Get the user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to generate copy');
      }
      
      // Create the request payload with Figma link data if available
      const payload = {
        workspaceId,
        type: formData.type,
        tone: formData.toneEmphasis.toLowerCase().includes('professional') ? 'professional' : 
              formData.toneEmphasis.toLowerCase().includes('conversational') ? 'conversational' : 
              formData.toneEmphasis.toLowerCase().includes('persuasive') ? 'persuasive' : 
              formData.toneEmphasis.toLowerCase().includes('concise') ? 'concise' : 'balanced',
        context: formData.context,
        elementName: formData.label,
        elementType: formData.type,
        // Include Figma design link data if available
        elementData: figmaLink ? { figmaLink } : undefined
      };
      
      console.log('Sending copy generation request:', payload);
      
      // Make the API request with authentication
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${session.access_token}\`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API response error:', errorData);
        throw new Error(errorData.error || 'Failed to generate copy');
      }
      
      const data = await response.json();
      console.log('API response:', data);
      
      return data.suggestions || []; // Ensure it returns an array
    } catch (error) {
      console.error('Error generating copy:', error);
      return []; // Return empty array on error
    }
  };
`;

const updatedContent = content.slice(0, insertAfterGeneratedSuggestions) + newFunction + content.slice(insertAfterGeneratedSuggestions);
fs.writeFileSync(filePath, updatedContent, 'utf8');

console.log('Updated generateCopy function successfully');
