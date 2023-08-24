<!--
 * @Description: 业务限定 批量上传组件
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-08-02 10:43:09
 * @LastEditors: wch
 * @LastEditTime: 2023-08-24 10:46:52
-->

<template>
    <div class="app-container">
        <div style="display: flex;">
            <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" style="width: 630px;" />
            <div style="display: flex; align-items: flex-end;">
                <el-button type="primary" @click="handleDownloadExcel" size="medium">下载模板</el-button>
                <el-button type="primary" @click="handleUpload" size="medium" style="margin-left: 20px;" :disabled="tableData.length == 0">确认上传</el-button>
            </div>
        </div>
        <el-table :data="tableData" border highlight-current-row style="width: 100%; margin-top:20px;">
            <el-table-column v-for="item of tableHeader" :key="item.id" :prop="item.id" :label="item.label" />
        </el-table>
    </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { addDerivationList } from '@/api/derivation.js'
import { addModifierList } from '@/api/modifier.js'
import { addTimeCycleList } from '@/api/timecycle'

export default {
    name: 'UploadExcel',
    components: { UploadExcelComponent },
    data() {
        return {
            type: this.$route.query.type,
            tHeader: [],
            tableData: [],
            tableHeader: [],
            errorMessage: ""
        }
    },
    mounted() {
    },
    methods: {
        beforeUpload(file) {
            const isLt1M = file.size / 1024 / 1024 < 1

            if (isLt1M) {
                return true
            }

            this.$message({
                message: '文件大小不能大于1M',
                type: 'warning'
            })
            return false
        },
        handleSuccess({ results, header }) {
            this.tableData = results
            this.tableHeader = header
            if (this.type == "derivation")
                this.tableHeader = [{id: "derivationName", label: "衍生词名称"}, {id: "calculationCaliber", label: "计算口径"}, {id: "description", label: "描述"}]
            else if (this.type == "modifier")
                this.tableHeader = [{id: "modifierName", label: "修饰词名称"}, {id: "modifierValueNames", label: "字段枚举"}, {id: "description", label: "描述"}]
            else if (this.type == "timeCycle")
                this.tableHeader = [{id: "timeCycleName", label: "时间周期名称"}, {id: "description", label: "描述"}]
        },
        handleDownloadExcel() {
            import('@/vendor/Export2Excel').then(excel => {
				if (this.type == "derivation")
                    this.tHeader = ["derivationName", "calculationCaliber", "description"]
                else if (this.type == "modifier")
                    this.tHeader = ["modifierName", "modifierValueNames", "description"]
                else if (this.type == "timeCycle")
                    this.tHeader = ["timeCycleName", "description"]

				excel.export_json_to_excel({
					header: this.tHeader,
                    data: [],
					filename: 'template-' + this.type
				})
			})
        },
        /**
         * @description: 上传文件内容
         * @return {*}
         * @author: wch
         */        
        handleUpload() {
            if (this.tableData.length == 0) {
                this.$notify({
                    title: '操作失败',
                    message: "上传内容为空",
                    type: 'error',
                    duration: 2000
                })
            }
            if (this.type == "derivation") {
                addDerivationList(this.tableData).then(response => {
                    if (response.success) {
                        this.$notify({
                            title: '操作成功',
                            message: response.message,
                            type: 'success',
                            duration: 2000
                        })
                        this.$router.back();
                    }
                    else {
                        this.$notify({
                            title: '操作失败',
                            message: response.message,
                            type: 'error',
                            duration: 2000
                        })
                        this.errorMessage = response.message
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
            else if (this.type == "modifier") {
                for (let  i = 0; i < this.tableData.length; i++){
                    this.tableData[i].modifierValueNames = this.tableData[i].modifierValueNames.split(",")
                }
                addModifierList(this.tableData).then(response => {
                    if (response.success) {
                        this.$notify({
                            title: '操作成功',
                            message: response.message,
                            type: 'success',
                            duration: 2000
                        })
                    }
                    else {
                        this.$notify({
                            title: '操作失败',
                            message: response.message,
                            type: 'error',
                            duration: 2000
                        })
                        this.errorMessage = response.message
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
            else if (this.type == "timeCycle") {
                addTimeCycleList(this.tableData).then(response => {
                    if (response.success) {
                        this.$notify({
                            title: '操作成功',
                            message: response.message,
                            type: 'success',
                            duration: 2000
                        })
                    }
                    else {
                        this.$notify({
                            title: '操作失败',
                            message: response.message,
                            type: 'error',
                            duration: 2000
                        })
                        this.errorMessage = response.message
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        resetTable() {
            this.tableData = [];
            this.tableHeader = [];
        },
    }
}
</script>
