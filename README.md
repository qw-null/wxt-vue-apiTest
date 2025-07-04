## solve_sync分支
该分支解决如下问题：
页面“保存草稿”按钮点击（同步任务）之后，展示通过API接口获取的数据（异步）。

必须保证异步任务结束之后，才能执行同步任务。

----
### 关键改进说明
1. 响应队列系统
```typescript
const responseQueue: ApiResponse[] = []; // 存储未处理的响应队列

// 在消息监听器中添加响应到队列
responseQueue.push(responseWithTimestamp);

// 处理队列中的响应
function processResponseQueue() {
  while (responseQueue.length > 0) {
    // 处理逻辑...
  }
}
```
+ 创建响应队列存储所有API响应

+ 确保不会丢失任何响应数据

2. 时间戳匹配机制
```typescript
// 在点击时记录时间
lastButtonClickTime = Date.now();

// 在响应中添加时间戳
const responseWithTimestamp = {
  ...event.data,
  timestamp: Date.now()
};

// 在队列处理中匹配时间
if (response.timestamp > lastButtonClickTime) {
  // 这是点击后产生的新响应
}
```
+ 使用时间戳确保只处理点击后产生的新响应

+ 避免使用旧数据更新弹窗

3. 状态管理改进
```typescript
let isWaitingForResponse = false; // 是否正在等待响应
let lastButtonClickTime = 0; // 最后一次点击时间
```
+ 使用 isWaitingForResponse 状态替代简单的布尔标志

+ 添加 lastButtonClickTime 精确匹配响应

4. 超时处理增强
```typescript
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
```
+ 添加用户友好的超时提示

+ 在超时时重置等待状态

5. 弹窗事件参数传递
```typescript
eventBus.dispatchEvent(new CustomEvent('OPEN_POPUP', {
  detail: { data: latestApiData }
}));
```
+ 通过 detail 属性传递最新数据

+ 确保弹窗显示的是最新的响应数据