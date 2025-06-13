export default defineUnlistedScript(() => {
  // 拦截 XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._url = url; // 存储请求 URL
    originalXHROpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    this.addEventListener('readystatechange', () => {
      if (this.readyState === 4) {
        const response = this.responseText;
        // 将响应数据发送到 content script
        window.postMessage({
          type: "NETWORK_RESPONSE",
          url: this._url,
          response
        }, '*');
      }
    });
    originalXHRSend.apply(this, arguments);
  };

  // 拦截 Fetch API
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const clonedResponse = response.clone();
    const data = await clonedResponse.text();
    window.postMessage({
      type: "NETWORK_RESPONSE",
      url: args[0] instanceof Request ? args[0].url : args[0],
      response: data
    }, '*');
    return response;
  };
});