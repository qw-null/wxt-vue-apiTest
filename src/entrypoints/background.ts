export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  // 存储已捕获的请求URL
  let targetUrls: string;
  // browser.webRequest.onBeforeRequest.addListener(
  //   (details) => {
  //     console.log("details信息", details);
  //     if (details.url.includes("businessTrip")) {
  //       targetUrls = details.url;
  //       console.log("拦截到", details.url);
  //       // processUrls(targetUrls)
  //     }
  //     // 非目标请求直接放行
  //     return { cancel: false };
  //   },
  //   { urls: ["<all_urls>"] },
  //   ["requestBody"]
  // );
  // browser.webRequest.onCompleted.addListener(
  //   async(details) => {
  //     // console.log("44444details信息", details);
  //     if (details.url.includes("businessTrip")&&details.url.includes("?_t=")) {
  //       targetUrls = details.url;
  //       console.log("==拦截到-----------", details.url);
  //     }
  //     // 非目标请求直接放行
  //     return { cancel: false };
  //   },
  //   { urls: ["<all_urls>"],types:["xmlhttprequest"] },
  //   ["responseHeaders"] 
  // );

  browser.runtime.onMessage.addListener((message) => {
    if (message.action === "logResponse") {
      // console.log("URL:", message.url);
      if(message.url.includes("businessTrip")&&message.url.includes("?_t=")){
        console.log("Response:", message.response); // 截断避免日志过大
      // 存储到本地或发送到服务器
      storage.setItem(`response信息啊啊啊:${Date.now()}`, message.response);
    }
      }
  });
});
