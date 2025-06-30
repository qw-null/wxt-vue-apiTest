<template>
  <el-container class="elContainer">
    <el-header class="elHeader">
      <el-row>
        <el-col :span="4">
          <img src="../assets/ctg-logo.svg" class="logo">
        </el-col>
        <el-col :span="20">
          <div class="urlContainer">
            <el-tag type="primary" effect="light" class="urlBtn">{{ urlHostname}}</el-tag>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="elMain">
      <div class="title">科研院智能台账助手</div>
      <p>使用教程📖</p>
      <p>第一步：xxxx;</p>
      <p>第二步：xxxx;</p>
      <p>第三步：xxxx;</p>
    </el-main>

      <div class="copyright">
         <StarFilled style="height: 1rem;color:#0D6FB8;margin-right: 5px;" />
        版权©：科研院信息技术研究中心
      </div>

  </el-container>
</template>
<script lang="ts" setup>
import { ref,onMounted } from "vue";

const urlHostname = ref<string>("正在获取URL...");
const currentUrl = ref<string>("正在获取URL...");
// 自动发送请求获取URL
onMounted(async () => {
  try {
    const res = await browser.runtime.sendMessage({ action: "getCurrentUrl" });
    currentUrl.value = res.url || "无法获取URL";
    const url = new URL(res.url);
    urlHostname.value = url.hostname;
  } catch (error) {
    currentUrl.value = "通信失败，请检查权限配置";
    console.error("Popup自动获取URL失败:", error);
  }
});
</script>
<style scoped>
.elContainer {
  /* background-color: aqua; */
  min-width: 320px;
}

.elHeader {
  display: flex;
  align-items: center;
  /* background-color: red; */
}
.elMain{
  margin-top: -10px;
}

.logo {
  width: 2rem;
  height: 2rem;
}

.urlContainer {
  width: 15rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.urlBtn {
  width: 80%;
  height: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
}

.copyright{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  font-size: 12px;
  background-color: #F2F4F7;
  margin: 5px 10px;
  border-radius: 4px;
  letter-spacing: 1px;
}
.title{
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-top: -10px;
}
</style>
