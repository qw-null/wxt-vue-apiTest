<template>
    <div>
        <el-button type="success" @click="show">Success</el-button>
        <el-dialog v-model="dialogVisible" title="Tips" width="500" :before-close="handleClose"></el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';

const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure to close this dialog?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}
const show = () => {
    dialogVisible.value = true;
}
</script>

<style scoped>
</style>

<style>
:host {
    /* Element Plus 样式需穿透 Shadow DOM */
    @import 'element-plus/dist/index.css';
}
</style>