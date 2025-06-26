export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  
  // 功能：监听来自content script的消息
  browser.runtime.onMessage.addListener((message, sender, callback) => {
    
    if (message.action === "CTG_toBackgroundResponse") {
      // console.log("URL:", message.response);
      // 处理真实需求代码
    //   if(message.url.includes("businessTrip")&&message.url.includes("?_t=")){
    //     console.log("Response:", message.response); // 截断避免日志过大
    //   // 存储到本地或发送到服务器
    //   storage.setItem(`response信息啊啊啊:${Date.now()}`, message.response);
    // }
      }
      if (message.action === "getCurrentUrl") {
      browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0]?.url || "无法获取 URL";
        callback({ url });
      });
      return true; // 保持通信通道开放，等待异步回调
    }
  });

});