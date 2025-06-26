<template>
    <div class="demo">
        <el-drawer v-model="props.showPopup.value" title="内部科研项目支出台账" direction="ltr" :before-close="handleClose" class="el-drawer"
            size="50%">
            <div class="drawer-container">
                <el-descriptions class="margin-top" :column="3" size="small" border>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                Username
                            </div>
                        </template>
                        kooriookami
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                Telephone
                            </div>
                        </template>
                        18100000000
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                Place
                            </div>
                        </template>
                        Suzhou
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                Remarks
                            </div>
                        </template>
                        <el-tag>School</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                Address
                            </div>
                        </template>
                        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            <template #footer>
                <div class="drawer-footer">
                    <el-button type="primary" :icon="SuccessFilled" @click="openDialog">确定</el-button>
                    <el-button type="info" :icon="CircleCloseFilled">取消</el-button>
                </div>
            </template>

        </el-drawer>
        <el-dialog v-model="dialogVisible" title="Tips" width="500"
            :before-close="handleCloseDialog">1111111</el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SuccessFilled,CircleCloseFilled } from '@element-plus/icons-vue'

const props = defineProps(['showPopup', 'msg'])

const dialogVisible = ref(false)
const drawer = ref(false)
const handleClose = (done: () => void) => {
    drawer.value = false;
}

const openDialog = () => {
    dialogVisible.value = true

}
const handleCloseDialog = () => {
    dialogVisible.value = false;
    drawer.value = false;
    props.showPopup.value = false;
}

// 监听showPopup变化
watch(() => props.showPopup, (newVal) => {
    if (newVal) {
        console.log('showPopup changed to true', newVal); // 当showPopup为true时触发打印
        drawer.value = true
    }
});

onMounted(() => {
    console.log('啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊Component mounted初始化', props.showPopup.value);

});
</script>

<style scoped>
</style>

<style>
:host {
    /* Element Plus 样式需穿透 Shadow DOM */
    @import 'element-plus/dist/index.css';
}
</style>