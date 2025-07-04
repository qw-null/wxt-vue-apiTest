import { createApp, ref } from 'vue';
import AlertPopup from '@/components/AlertPopup.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 定义 API 数据的类型
interface ApiResponse {
  type: string;
  url: string;
  data?: any;
  timestamp?: number;
  [key: string]: any;
}

export default defineContentScript({
  // matches: ['*://*/*'],
  matches: ['https://rs.ctg.com.cn/*'],
  // 设置 cssInjectionMode
  cssInjectionMode: 'ui',
  async main(ctx) {
    // 动态检测目标页面
    const isTargetPage =
      window.location.port === '9000' &&
      window.location.hash.startsWith('#/reimbs/businessTrip');
    // 非目标页面直接退出
    if (!isTargetPage) return;

    const showPopup = ref(false);  // 创建响应式状态控制弹窗显隐
    const msg = ref<ApiResponse | null>(null); // 使用类型注解
    const eventBus = new EventTarget();

    // 状态管理变量
    let latestApiData: ApiResponse | null = null;
    let isWaitingForResponse = false;
    let lastButtonClickTime = 0;
    const responseQueue: ApiResponse[] = []; // 存储未处理的响应队列

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
        // 监听外部事件
        eventBus.addEventListener('OPEN_POPUP', (e: CustomEvent) => {
          if (e.detail && e.detail.data) {
            showPopup.value = true;
            msg.value = e.detail.data;
          }
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
    await injectScript("/injected.js", { keepInDom: true });// keepInDom: true - 保持脚本持久化
    console.log("JS脚本已注入");

    // --------监听 injected 脚本发送的消息------------
    window.addEventListener('message', (event) => {
      if (event.data?.type === "CTG_NETWORK_RESPONSE") {
        // 将数据转发到后台脚本 (background.ts)
        console.log("将数据转发到后台脚本", event.data);
        const responseWithTimestamp = {
          ...event.data,
          timestamp: Date.now()
        };

        console.log("API数据已接收:", responseWithTimestamp);
        // 添加到响应队列
        responseQueue.push(responseWithTimestamp);

        // 处理队列中的响应
        processResponseQueue();

        browser.runtime.sendMessage({
          action: "CTG_toBackgroundResponse",
          url: event.data.url,
          response: event.data
        });
      }
    });

    // 功能3：监听页面指定按钮的点击事件
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      console.log('点击了按钮click click', target.innerText);
      if (target.innerText == '保存草稿') {
        // 向后台脚本发送消息
        console.log("===点击了保存草稿按钮==");
        // 记录点击时间
        lastButtonClickTime = Date.now();

        // 设置等待状态
        isWaitingForResponse = true;

        // 设置超时处理
        setTimeout(() => {
          if (isWaitingForResponse) {
            console.warn("等待API响应超时");
            isWaitingForResponse = false;

            // 显示超时提示
            eventBus.dispatchEvent(new CustomEvent('OPEN_POPUP', {
              detail: {
                data: {
                  type: "TIMEOUT_ERROR",
                  message: "API响应超时，请重试",
                  timestamp: Date.now()
                }
              }
            }));
          }
        }, 5000); // 5秒超时
      }
    })

    // 处理响应队列
    function processResponseQueue() {
      while (responseQueue.length > 0) {
        const response = responseQueue.shift();

        // 检查是否有等待中的点击事件
        if (isWaitingForResponse && response) {
          // 检查响应时间是否在点击之后
          if (response.timestamp > lastButtonClickTime) {
            console.log("匹配到最新的API响应");
            isWaitingForResponse = false;
            latestApiData = response;

            // 触发弹窗显示最新数据
            eventBus.dispatchEvent(new CustomEvent('OPEN_POPUP', {
              detail: { data: latestApiData }
            }));

            // 处理完一个响应后跳出循环
            break;
          }
        }
      }
    }

  }
});
