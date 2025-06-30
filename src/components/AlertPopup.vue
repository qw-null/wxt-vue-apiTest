<template>
    <div class="demo">
        <div class="tipsText">（点击保存草稿生成项目台账）➡️</div>
        <el-drawer v-model="props.showPopup.value" title="内部科研项目支出台账" direction="ltr" :before-close="handleCloseDialog" class="el-drawer"
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
                        School
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
            信息：{{ props.msg }}
            <template #footer>
                <div class="drawer-footer">
                    <el-button type="primary" :icon="SuccessFilled" @click="openDialog">确定</el-button>
                    <el-button type="info" :icon="CircleCloseFilled" @click="handleCloseDialog">取消</el-button>
                </div>
            </template>

        </el-drawer>
        <el-dialog v-model="dialogVisible" title="🔔 信息确认" width="500" center>
            <span class="confirm-txt">是否上传《差旅费报销单》用于项目台账生成？</span>
            <template #footer>
                <el-button type="info" @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" @click="handleCloseDialog">上传</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SuccessFilled,CircleCloseFilled,Right } from '@element-plus/icons-vue'

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
</script>

<style scoped>
.tipsText{
    font-size: 18px;
    font-weight: 800;
    color: red;
    position: fixed;
    left: 52%;
    bottom: 20px;
}
.confirm-txt{
    display: block;
    margin: 1rem;
    font-weight: 600;
    color:red;
}
</style>

<style>
:host {
    /* Element Plus 样式需穿透 Shadow DOM */
    @import 'element-plus/dist/index.css';
}
</style>