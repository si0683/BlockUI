/*! LightWebsiteUi 3.2.1 — ES module entry. MIT License. https://github.com/si0683/LightWebsiteUi */
// LightWebsiteUi is a browser script that defines window.LightWebsiteUi; this file re-exports it.
// Imported from a bundler (React, Next.js, Vite) it waits for start(): nothing touches the page
// before your framework has rendered it. The manual flag must be set before the script runs.
import './lightwebsiteui.manual.mjs';
import './lightwebsiteui.js';

const LightWebsiteUi = typeof window !== 'undefined' ? window.LightWebsiteUi : undefined;
export default LightWebsiteUi;
export const start = (options) => LightWebsiteUi && LightWebsiteUi.start(options);
export const refresh = () => LightWebsiteUi && LightWebsiteUi.refresh();
export const destroy = () => LightWebsiteUi && LightWebsiteUi.destroy();
export const version = '3.2.1';
