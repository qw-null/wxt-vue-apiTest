export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  browser.webRequest.onBeforeRequest.addListener(
    (details) => {
      console.log("details信息", details);
      if (details.method === "POST") {
        // 解码请求体（解决中文乱码）
        const rawData = details.requestBody?.raw?.[0]?.bytes;
        if (rawData) {
          const decoder = new TextDecoder('utf-8');
          const postData = decoder.decode(rawData);
          console.log("拦截到的请求参数:", postData);
        }
        

      }
      // 非目标请求直接放行
      return { cancel: false };
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
  );
});
