// Test our simplified Figma ID extraction logic on various URL formats

// Test URLs
const urls = [
  "https://www.figma.com/file/abcdef123456/MyDesign",
  "https://figma.com/file/abcdef123456/",
  "https://www.figma.com/design/VKAaxBD4Pa8jXUNyUXUEfG/Tags?node-id=0-1",
  "http://figma.com/design/VKAaxBD4Pa8jXUNyUXUEfG/tags",
  "https://www.figma.com/proto/xyz789/Prototype",
  "https://www.figma.com/community/file/123456789/Community-File",
  "https://figma.com/file/abcdef123456?node-id=123",
  "figma.com/file/abcdef123456/"
];

// Simplified logic for extraction
function extractFigmaIDs(url) {
  // Standard file link
  const fileRegex = /figma\.com\/file\/([a-zA-Z0-9]+)\//;
  const fileMatch = url.match(fileRegex);
  
  // Design link
  const designRegex = /figma\.com\/design\/([a-zA-Z0-9]+)\//;
  const designMatch = url.match(designRegex);
  
  // Proto link
  const protoRegex = /figma\.com\/proto\/([a-zA-Z0-9]+)\//;
  const protoMatch = url.match(protoRegex);
  
  // Community link
  const communityRegex = /figma\.com\/community\/file\/([a-zA-Z0-9]+)\//;
  const communityMatch = url.match(communityRegex);
  
  // Extract node ID if present
  const nodeMatch = url.match(/node-id=([^&\s]+)/i);
  
  let fileKey = null;
  let source = "none";
  
  if (fileMatch && fileMatch[1]) {
    fileKey = fileMatch[1];
    source = "file";
  } else if (designMatch && designMatch[1]) {
    fileKey = designMatch[1];
    source = "design";
  } else if (protoMatch && protoMatch[1]) {
    fileKey = protoMatch[1];
    source = "proto";
  } else if (communityMatch && communityMatch[1]) {
    fileKey = communityMatch[1];
    source = "community";
  }
  
  return {
    url,
    fileKey,
    nodeId: nodeMatch ? nodeMatch[1] : null,
    source
  };
}

// Test each URL
urls.forEach((url, index) => {
  console.log(`Test ${index + 1}:`);
  const result = extractFigmaIDs(url);
  console.log(result);
  console.log("---");
});

// Special test for the URL in the issue
const problematicUrl = "https://www.figma.com/design/VKAaxBD4Pa8jXUNyUXUEfG/Tags?node-id=0-1&t=5ImN0bQyvhzbmtWm-1";
console.log("Testing problematic URL:");
console.log(extractFigmaIDs(problematicUrl)); 