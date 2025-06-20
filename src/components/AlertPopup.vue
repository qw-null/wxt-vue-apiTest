<template>
    <div class="demo" v-if="props.showPopup.value">
        <el-button type="success" @click="show">Success</el-button>
        <el-drawer v-model="drawer" title="I am the title" direction="ltr" :before-close="handleClose"
            class="el-drawer">
            <span>Hi, there!</span>
            {{ props.msg.value }}
            <el-button type="primary" @click="openDialog">打开</el-button>
        </el-drawer>
        <el-dialog v-model="dialogVisible" title="Tips" width="500"
            :before-close="handleCloseDialog">1111111</el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps(['showPopup','msg'])

const dialogVisible = ref(false)
const drawer = ref(false)

const handleClose = (done: () => void) => {
    drawer.value = false;
}
const show = () => {
    drawer.value = true;
}

const openDialog = () => {
    dialogVisible.value = true

}
const handleCloseDialog = () => {
    dialogVisible.value = false;
    drawer.value = false;
    props.showPopup.value=false;
}

// 监听showPopup变化
watch(() => props.showPopup, (newVal) => {
    if (newVal) {
        console.log('showPopup changed to true', newVal); // 当showPopup为true时触发打印
    }
});

onMounted(() => {
    console.log('Component mounted初始化', props.showPopup.value);

});
</script>

<style scoped>
.demo {
    position: fixed;
    top: 0;
    left: 0;
    height: 100px;
    width: 200px;
    background-color: red;
    z-index: 3000;
}
</style>

<style>
:host {
    /* Element Plus 样式需穿透 Shadow DOM */
    @import 'element-plus/dist/index.css';
}
</style>