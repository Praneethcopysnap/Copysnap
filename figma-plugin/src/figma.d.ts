// Type definitions for Figma Plugin API
// Simplified version for our needs

declare const figma: {
  currentPage: {
    selection: SceneNode[];
  };
  ui: {
    show: () => void;
    hide: () => void;
    resize: (width: number, height: number) => void;
    onmessage: (callback: (msg: any) => void) => void;
    postMessage: (msg: any) => void;
  };
  closePlugin: () => void;
  showUI: (htmlString: string, options?: { width?: number; height?: number }) => void;
  notify: (message: string, options?: { timeout?: number }) => void;
};

declare const __html__: string;

declare interface SceneNode {
  id: string;
  name: string;
  type: string;
  children?: SceneNode[];
  characters?: string;
} 