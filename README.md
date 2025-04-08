# CopySnap

CopySnap is a context-aware UX copy generator that helps designers, product managers, and writers create better microcopy for their digital products.

## Key Features

- **Context-Aware Copy Generation:** Generate UX copy based on product context from screens, documents, and brand voice
- **Figma Plugin:** Generate copy directly within your design workflow
- **Brand Voice Definition:** Define and maintain a consistent brand voice across all copy
- **Content Library:** Save and organize all your UX copy in one place

## Project Structure

```
copysnap/
├── app/                  # Next.js application folder
│   ├── components/       # Reusable React components
│   ├── dashboard/        # Dashboard pages
│   ├── figma-plugin/     # Figma plugin demo
│   ├── login/            # Authentication pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home/landing page
├── public/               # Static assets
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Development Roadmap

- [x] Landing page with waitlist signup
- [x] User authentication (login/signup)
- [x] Dashboard UI
- [x] Figma plugin demo
- [ ] Workspace management
- [ ] Document upload and processing
- [ ] Brand voice definition interface
- [ ] Content library and organization
- [ ] AI-powered copy generation
- [ ] Figma plugin integration

## Logo Integration
To properly display the CopySnap logo:

1. Create a `public/images` directory in the project root if it doesn't already exist
2. Save the CopySnap logo file as `logo.png` in the `public/images` directory
3. The logo will automatically appear in the header component 