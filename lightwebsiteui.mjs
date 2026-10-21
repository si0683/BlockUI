/*! LightWebsiteUi 3.0.0 — ES module entry. MIT License. https://github.com/si0683/LightWebsiteUi */
// LightWebsiteUi is a browser script that defines window.LightWebsiteUi; this file re-exports it.
import './lightwebsiteui.js';

const LightWebsiteUi = typeof window !== 'undefined' ? window.LightWebsiteUi : undefined;
export default LightWebsiteUi;
export const start = (options) => LightWebsiteUi.start(options);
export const version = '3.0.0';
