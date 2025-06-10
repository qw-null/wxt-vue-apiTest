import { createApp } from 'vue';
import InterceptionApi from '@/components/InterceptionApi.vue';

export default defineContentScript({
  matches: ['https://campus.kuaishou.cn/*'],
  main(ctx) {
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

    // 监听所有按钮点击
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      console.log("点击了按钮$$$$", target.tagName,target?.textContent.replace(/\s*/g, ""));
      if (target?.textContent.replace(/\s*/g, "") == '搜索') {
        // 标记被监控的按钮
        console.log("进来了",window.fetch)
        target.dataset.monitored = "true";
        const originalFetch = window.fetch;
        window.fetch = async (input, init) => {
          if (init?.method === 'POST') {
            console.log("拦截到POST数据:", init.body);
            // 发送数据到background
            browser.runtime.sendMessage({
              type: "POST_DATA",
              data: init.body
            });
          }
          return originalFetch(input, init);
        };

      }
    });
  },
});
