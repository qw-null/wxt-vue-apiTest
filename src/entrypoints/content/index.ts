import { createApp, ref } from 'vue';
import AlertPopup from '@/components/AlertPopup.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';


export default defineContentScript({
  matches: ['*://*/*'],
  // 设置 cssInjectionMode
  cssInjectionMode: 'ui',
  // matches: ['https://rs.ctg.com.cn:9000/#/reimbs/businessTrip/*'],
  async main(ctx) {
    const showPopup = ref(false);  // 创建响应式状态控制弹窗显隐
    const msg = ref({})
    const eventBus = new EventTarget();
    let resMsg = {}
    // 功能1：页面注入SPA页面
    const ui = await createShadowRootUi(ctx, {
      name: 'vue-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        const app = createApp(AlertPopup, {
          showPopup,
          msg
        });
        // 监听外部事件 [!code ++:5]
        eventBus.addEventListener('OPEN_POPUP', () => {
          console.log('监听到外部事件Open——popup',resMsg);
          showPopup.value = true;
          msg.value = resMsg;
        });
        app.use(ElementPlus);
        app.mount(container);
        return app;
      },
      onRemove: (app) => {
        app?.unmount();
      },
    });
    ui.mount();

    // 功能2：注入JS脚本
    await injectScript("/injected.js", {
      keepInDom: true // 保持脚本持久化
    });
    // --------监听 injected 脚本发送的消息
    window.addEventListener('message', (event) => {
      if (event.data?.type === "CTG_NETWORK_RESPONSE") {
        // 将数据转发到后台脚本 (background.ts)
        console.log("将数据转发到后台脚本", event.data);
        resMsg = event.data;
        browser.runtime.sendMessage({
          action: "CTG_toBackgroundResponse",
          url: event.data.url,
          response: event.data.response
        });
      }
    });

    // 功能3：监听页面指定按钮的点击事件
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      console.log('点击了按钮click click', target.innerText);

      if (target.innerText == '新增') {
        // 向后台脚本发送消息
        console.log("=================点击了新增按钮");
        eventBus.dispatchEvent(new CustomEvent('OPEN_POPUP'));
      }

    })

  }
});
