const figmaLink = 'https://www.figma.com/design/VKAaxBD4Pa8jXUNyUXUEfG/Tags?node-id=0-1&t=5ImN0bQyvhzbmtWm-1';

// Testing all patterns with updated regex
const fileMatch = figmaLink.match(/file\/([a-zA-Z0-9]+)(?:\/|$)/i);
const protoMatch = figmaLink.match(/proto\/([a-zA-Z0-9]+)(?:\/|$)/i);
const designMatch = figmaLink.match(/design\/([a-zA-Z0-9]+)(?:\/|$)/i);
const communityMatch = figmaLink.match(/community\/(?:file|design)\/([a-zA-Z0-9]+)(?:\/|$)/i);
const nodeMatch = figmaLink.match(/node-id=([^&\s]+)/i);

console.log('Link being tested:', figmaLink);
console.log('File match:', fileMatch);
console.log('Proto match:', protoMatch);
console.log('Design match:', designMatch);
console.log('Community match:', communityMatch);
console.log('Node ID match:', nodeMatch);

// Parsing logic
let fileKey = null;
let nodeId = null;

if (fileMatch && fileMatch[1]) {
  fileKey = fileMatch[1];
  console.log('Extracted file key from standard file link:', fileKey);
} else if (protoMatch && protoMatch[1]) {
  fileKey = protoMatch[1];
  console.log('Extracted file key from prototype link:', fileKey);
} else if (designMatch && designMatch[1]) {
  fileKey = designMatch[1];
  console.log('Extracted file key from design link:', fileKey);
} else if (communityMatch && communityMatch[1]) {
  fileKey = communityMatch[1];
  console.log('Extracted file key from community link:', fileKey);
} else {
  const genericKeyMatch = figmaLink.match(/([a-zA-Z0-9]{15,})/);
  if (genericKeyMatch && genericKeyMatch[1]) {
    fileKey = genericKeyMatch[1];
    console.log('Extracted potential file key using generic pattern:', fileKey);
  } else {
    console.log('Could not extract file key');
  }
}

if (nodeMatch && nodeMatch[1]) {
  nodeId = nodeMatch[1];
  console.log('Extracted node ID:', nodeId);
}

// Now apply sanitization for Figma API
const sanitizedFileKey = fileKey ? fileKey.replace(/[^a-zA-Z0-9]/g, '') : null;
console.log('Final sanitized key:', sanitizedFileKey);

console.log('Final results - fileKey:', fileKey, 'sanitizedFileKey:', sanitizedFileKey, 'nodeId:', nodeId); 