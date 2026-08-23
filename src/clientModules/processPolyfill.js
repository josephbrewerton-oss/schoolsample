// src/clientModules/processPolyfill.js
if (typeof window !== 'undefined') {
  window.process = window.process || { env: { NODE_ENV: 'production' } };
}