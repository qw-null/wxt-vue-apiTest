import { createApp } from 'vue';
import InterceptionApi from '@/components/InterceptionApi.vue';

export default defineContentScript({
  matches: ['*://*/*'],
  // matches: ['https://rs.ctg.com.cn:9000/#/reimbs/businessTrip/*'],
  async main(ctx) {

    await injectScript("/injected.js", {
      keepInDom: true // 保持脚本持久化
    });

    // 监听 injected 脚本发送的消息
    window.addEventListener('message', (event) => {
      if (event.data?.type === "NETWORK_RESPONSE") {
        // 将数据转发到后台脚本 (background.ts)
        browser.runtime.sendMessage({
          action: "logResponse",
          url: event.data.url,
          response: event.data.response
        });
      }
    });

    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Create the app and mount it to the UI container
        const app = createApp(InterceptionApi);
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        if (app) {
          app.unmount();
        }
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();


  }
});
