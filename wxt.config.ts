import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    permissions: [
      "scripting",
      "activeTab",
      "webRequest",
      "webRequestBlocking",
      "storage"
    ],
    host_permissions: ["<all_urls>"]
  }
});
