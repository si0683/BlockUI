/*! BlockUI 2.0.0 — ES module entry. MIT License. https://github.com/si0683/BlockUI */
// BlockUI is a browser script that defines window.BlockUI; this file re-exports it.
import './blockui.js';

const BlockUI = typeof window !== 'undefined' ? window.BlockUI : undefined;
export default BlockUI;
export const start = (options) => BlockUI.start(options);
export const version = '2.0.0';
