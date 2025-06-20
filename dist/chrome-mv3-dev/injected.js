var injected = function() {
  "use strict";
  function defineUnlistedScript(arg) {
    if (arg == null || typeof arg === "function") return { main: arg };
    return arg;
  }
  const utils = {
    init: () => console.log("Utils initialized")
  };
  injected;
  const definition = defineUnlistedScript(() => {
    utils.init();
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) {
      this._url = url instanceof URL ? url.toString() : url;
      originalXHROpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function(body) {
      this.addEventListener("readystatechange", () => {
        if (this.readyState === 4) {
          const response = this.responseText;
          console.log("===抓到信息====", response);
          window.postMessage({
            type: "CTG_NETWORK_RESPONSE",
            url: this._url,
            response
          }, "*");
        }
      });
      originalXHRSend.apply(this, arguments);
    };
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const clonedResponse = response.clone();
      const data = await clonedResponse.text();
      window.postMessage({
        type: "NETWORK_RESPONSE",
        url: args[0] instanceof Request ? args[0].url : args[0],
        response: data
      }, "*");
      return response;
    };
  });
  injected;
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  const result = (async () => {
    try {
      initPlugins();
      return await definition.main();
    } catch (err) {
      logger.error(
        `The unlisted script "${"injected"}" crashed on startup!`,
        err
      );
      throw err;
    }
  })();
  return result;
}();
injected;
