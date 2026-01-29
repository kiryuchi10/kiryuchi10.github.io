/// <reference types="vite/client" />

declare module 'vanta/dist/vanta.globe.min' {
  const GLOBE: (opts: Record<string, unknown>) => { destroy: () => void };
  export default GLOBE;
}

declare module 'vanta/dist/vanta.globe.min.js' {
  const GLOBE: (opts: Record<string, unknown>) => { destroy: () => void };
  export default GLOBE;
}
