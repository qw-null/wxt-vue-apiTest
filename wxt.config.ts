import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  // 相对于项目根目录
  srcDir: "src",             // 默认值："."
  outDir: "dist",            // 默认值：".output"


  modules: ['@wxt-dev/module-vue'],
  runner: {
    startUrls: ["https://www.baidu.com"],
  },
  manifest: {
    permissions: [
      "<all_urls>",
      "scripting",
      "webRequest",
      "webRequestBlocking",
      "storage"
    ],
    web_accessible_resources: [{
      resources: ["injected.js","element-plus.css"], // 允许被页面访问的资源
      matches: ["*://*/*"]        // 允许的域名
    }]
  }
});
