# CopySnap Figma Plugin

Generate context-aware UX copy directly within Figma. This plugin helps designers create better UX copy by extracting context from your designs and leveraging AI to suggest appropriate text.

## Features

- Extract text and context from selected frames
- Generate UX copy based on design context
- Choose different copy styles and tones
- Apply generated copy directly to your design
- Connect with CopySnap web platform for advanced features

## Development Setup

1. **Clone the repository**
   ```
   git clone https://github.com/your-org/copysnap-figma-plugin.git
   cd copysnap-figma-plugin
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Development mode**
   ```
   npm run dev
   ```
   This will watch for file changes and rebuild the plugin automatically.

4. **Production build**
   ```
   npm run build
   ```

## Loading the Plugin in Figma

1. Open the Figma desktop app
2. Go to Plugins > Development > New Plugin
3. Click "Link existing plugin"
4. Select the `manifest.json` file from this repository

## Project Structure

- `src/code.ts` - Plugin code that runs in Figma
- `src/ui/ui.html` - HTML for the plugin UI
- `src/ui/ui.ts` - UI code that runs in the iframe
- `dist/` - Built plugin files (generated)
- `manifest.json` - Plugin configuration

## Connecting to the CopySnap API

Currently, the plugin uses mock data for demonstration. To connect it to your backend:

1. Update the `API_ENDPOINT` constant in `src/ui/ui.ts`
2. Uncomment and modify the fetch API calls in the `generateCopy` function
3. Implement proper authentication with your CopySnap account

## Next Steps

### Backend Integration

For the plugin to work fully with CopySnap, you'll need to:

1. Create API endpoints for:
   - Text analysis and copy generation
   - User authentication
   - Saving/retrieving copy history
   - Team collaboration features

2. Implement authentication flow between the plugin and your SaaS app

### Advanced Features

Future enhancements could include:
- Brand voice profiles
- Copy suggestions based on past choices
- Team collaboration tools
- Analytics and insights

## Publishing the Plugin

1. Test thoroughly with different Figma file structures
2. Create promotional images and text for the Figma Community page
3. Submit for review through the Figma plugin developer dashboard

## Getting Help

If you need assistance with the plugin, contact support@copysnap.io or visit our [documentation](https://copysnap.io/docs). 