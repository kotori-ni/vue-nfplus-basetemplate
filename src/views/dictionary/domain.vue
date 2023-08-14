<!--
 * @Description: 指标管理->指标域管理
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-14 14:38:19
 * @LastEditors: wch
 * @LastEditTime: 2023-08-14 15:09:06
-->

<template>
    <div class="app-container">
        <div class="filter-container" style="display: inline-block; width: 100%;">
            <el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit"
                @click="dialogAddFromVisible = true">
                新建一级指标域
            </el-button>
            <el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="handleBatchUpload">
                批量导入
            </el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" size="mini" type="primary"
                icon="el-icon-download" @click="dialogVisible = true">
                导出
            </el-button>
            <div style="float: right;" class="search_item">
                <el-select v-model="domainQuery.sort" placeholder="请选择" clearable style="width: 120px; margin-right: 10px;">
                    <el-option v-for="item in types" :key="item.key" :label="item.label" :value="item.key" />
                </el-select>
                <el-input v-model="domainQuery.keyword" placeholder="请输入关键词" clearable style="width: 150px;"
                    class="input" />
                <el-link :underline="false" style="margin-left: 10px; margin-right: 10px;"
                    @click="handleResetSearchQuery">重置<i class="el-icon-setting el-icon--right"
                        style="float: right;"></i></el-link>
                <el-button v-waves class="search-item" type="primary" icon="el-icon-search" @click="handleSearch"
                    size="mini">搜索</el-button>
            </div>
        </div>

        <hr style="height: 1px; background-color: #ddd; margin-top: 10px; margin-bottom: 5px; border: none;" />

        <el-table :key="tableKey" :data="domains" border fit highlight-current-row :row-class-name="tableRowClassName"
            style="width: 100%; margin-top: 10px; border: 1px solid #ddd;" :cell-style="tableCellStyle"
            :header-cell-style="tableHeaderCellStyle" row-key="value"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column label="指标域名称" prop="domainName" min-width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.label }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建者" width="150" prop="creatorName" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.creatorName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" min-width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{ parse(row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="子域数量" prop="createTime" width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.childNum }}</span>
                </template>
            </el-table-column>
            <el-table-column label="指标数量" prop="createTime" width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.indicatorNum }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="360" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
                    <el-button v-if="row.indicatorNum != 0" size="mini" @click="handleQuote(row)" type="primary">
                        引用详情</el-button>
                    <el-button v-if="row.indicatorNum == 0" size="mini"
                        @click="dialogAddFromVisible = true; newDomain.parentDomainId = row.value" type="success">
                        新建子指标域</el-button>
                    <el-button v-if="row.indicatorNum == 0 && row.children == null" size="mini" @click="handleDelete(row)"
                        type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="新增指标域" :visible.sync="dialogAddFromVisible">
            <el-form ref="addForm" :rules="rules" :model="newDomain" label-position="left" label-width="auto">
                <el-form-item label="指标域名称" prop="domainName">
                    <el-input v-model="newDomain.domainName" placeholder="1-64个字符" maxlength="128" show-word-limit autosize
                        type="textarea" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleBack">返回</el-button>
                <el-button type="primary" @click="addDomain">确认添加</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑指标域" :visible.sync="dialogEditFromVisible">
            <el-form ref="editForm" :rules="rules" :model="existDomain" label-position="left" label-width="auto">
                <el-form-item label="指标域名称" prop="domainName">
                    <el-input v-model="existDomain.domainName" placeholder="1-64个字符" maxlength="128" show-word-limit
                        autosize type="textarea" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleBack">返回</el-button>
                <el-button type="primary" @click="editDomain">确认修改</el-button>
            </div>
        </el-dialog>

        <el-dialog title="导出设定" :visible.sync="dialogVisible" width="30%">
            <span>导出本页的指标域还是全部指标域?</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="downloadPage">仅本页</el-button>
                <el-button type="primary" @click="downloadAll">全部</el-button>
            </span>
        </el-dialog>

        <el-dialog title="指标域引用详情" :visible.sync="quoteVisible" width="50%">
            <el-table :data="quoteIndicators" border>
                <el-table-column prop="indicatorId" label="指标标识" align="center">
                    <template slot-scope="{row}">
                        <el-link type="primary" :underline="false" @click="handlePath(row.indicatorId)">{{ row.indicatorId
                        }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="indicatorName" label="指标名称" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.indicatorName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="businessCaliberLeader" label="业务口径负责人" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.businessCaliberLeader }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import { getAllDomainList, addDomain, updateDomain, deleteDomain, findQuoteIndicators } from '@/api/domain';
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'

export default {
    directives: { waves },
    data() {
        return {
            tableKey: 0,
            domains: undefined,
            newDomain: {
                domainId: undefined,
                domainName: undefined,
                parentDomainId: undefined,
            },
            existDomain: {
                domainId: undefined,
                domainName: undefined,
            },
            domainQuery: {
                page: 1,
                pageSize: 10,
                sort: undefined,
                keyword: undefined,
            },
            downloadLoading: false,
            dialogVisible: false,
            dialogAddFromVisible: false,
            dialogEditFromVisible: false,
            quoteVisible: false,
            quoteIndicators: undefined,
            types: [{ key: "all", label: "全部" }, { key: "domainName", label: "指标域名称" }, { key: "creatorName", label: "创建者" }],
            rules: {
                DomainName: [
                    { required: true, message: '请输入指标域名称', trigger: 'blur' },
                    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    mounted() {
        this.getDomainList();
    },
    methods: {
        /**
         * @description: 获取所有指标域
         * @return {*}
         * @author: wch
         */
        getDomainList() {
            getAllDomainList({ needAll: false, allowParent: true }).then(res => {
                this.domains = res.data.domains
            });
        },
        /**
         * @description: 添加新指标域
         * @return {*}
         * @author: wch
         */
        addDomain() {
            this.$refs['addForm'].validate((valid) => {
                if (valid) {
                    this.newDomain.domainId = undefined
                    addDomain(this.newDomain).then(response => {
                        if (response.success) {
                            this.$notify({
                                title: '操作成功',
                                message: response.message,
                                type: 'success',
                                duration: 2000
                            })
                            this.dialogAddFromVisible = false
                            this.resetDomain();
                            this.getDomainList();
                        }
                        else {
                            this.$notify({
                                title: '操作失败',
                                message: response.message,
                                type: 'error',
                                duration: 2000
                            })
                        }
                    }).catch(error => {
                        console.log(error);
                    });

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        /**
         * @description: 修改指标域信息
         * @return {*}
         * @author: wch
         */
        editDomain() {
            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    updateDomain(this.existDomain).then(response => {
                        if (response.success) {
                            this.$notify({
                                title: '操作成功',
                                message: response.message,
                                type: 'success',
                                duration: 2000
                            })
                            this.dialogEditFromVisible = false
                            this.resetDomain();
                            this.getDomainList();
                        }
                        else {
                            this.$notify({
                                title: '操作失败',
                                message: response.message,
                                type: 'error',
                                duration: 2000
                            })
                        }
                    }).catch(error => {
                        console.log(error);
                    });

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetDomain() {
            this.newDomain = {
                domainId: undefined,
                domainName: undefined,
                parentDomainId: undefined,
            };
            this.existDomain = {
                domainId: undefined,
                domainName: undefined,
            };
        },
        parse(createTime) {
            return parseTime(new Date(createTime), '{y}-{m}-{d} {h}:{i}')
        },
        tableRowClassName(row) {
            if (row.children && row.children.length > 0) {
                return 'success-row';
            }
            return '';
        },
        handleEdit(row) {
            this.existDomain.domainId = row.value
            this.existDomain.domainName = row.label
            this.dialogEditFromVisible = true
        },
        /**
         * @description: 获取指标域中的指标
         * @param {*} row
         * @return {*}
         * @author: wch
         */
        handleQuote(row) {
            findQuoteIndicators({ domainId: row.value }).then(res => {
                if (res.success) {
                    this.quoteIndicators = res.data.indicators
                    this.quoteVisible = true
                }
            })
        },
        handleBack() {
            this.dialogAddFromVisible = false;
            this.dialogEditFromVisible = false;
            this.resetDomain();
        },
        handleBatchUpload() {

        },
        handleResetSearchQuery() {
            this.domainQuery = {
                page: 1,
                pageSize: 10,
                sort: undefined,
                keyword: undefined,
            };
            this.getDomainList();
        },
        handleSearch() {

        },
        /**
         * @description: 删除指标域
         * @param {*} row
         * @return {*}
         * @author: wch
         */
        handleDelete(row) {
            deleteDomain({ domainId: row.value }).then(res => {
                if (res.success) {
                    this.$notify({
                        title: '操作成功',
                        message: res.message,
                        type: 'success',
                        duration: 2000
                    })
                    this.getDomainList();
                }
                else {
                    this.$notify({
                        title: '操作失败',
                        message: res.message,
                        type: 'error',
                        duration: 2000
                    })
                }
            });
        },
        downloadPage() {

        },
        downloadAll() {

        },
        tableCellStyle() {
            return "border-color: #ddd;"
        },
        tableHeaderCellStyle() {
            return "border-color: #ddd; text-align: center;"
        },
    },
};
</script>

<style>
.search_item .el-input__inner {
    height: 32px;
    color: #000;

    &::placeholder {
        color: black;
        font-size: 14px;
    }
}

.search_item .el-input__icon {
    height: 115%;
}

.search_item .el-input .el-select_Caret.is-reverse {
    line-height: 5px;
}

.el-table td {
    padding-top: 6px;
    padding-bottom: 6px;
}

.el-table .el-table__row--level-1 {
    background: #f0f9eb;
}
</style>