<!--
 * @Description: 指标管理->详细信息
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-08-02 21:06:36
 * @LastEditors: wch
 * @LastEditTime: 2023-08-15 15:18:19
-->

<template>
    <div style="margin-left: 35px; margin-right: 35px;">
        <div class="indicator_header" style="height: 100px; display: flex; flex-direction: row;">
            <div class="indicator_icon_container">
                <i class="el-icon-picture"></i>
                <div class="indicator_type">{{ indicator.indicatorTypeName }}</div>
            </div>
            <div class="indicator_name" style="margin-left: 20px; margin-top: 20px;">
                <div style="font-weight: bold; font-size: 14px;">{{ indicator.indicatorName }} ({{ indicator.indicatorId }})
                </div>
                <div style="margin-top: 10px; font-size: 12px;">业务口径: {{ indicator.businessCaliber }}</div>
                <div style="margin-top: 10px; display: flex; flex-direction: row; margin-top: inherit;">
                    <el-tag class="indicator_version" effect="plain" type="info"
                        style="width: 35px; color: #222;">最新</el-tag>
                    <el-tag class="indicator_version" effect="plain" type="primary" style="width: 50px;">{{
                        indicator.version.versionNum }}</el-tag>
                    <el-tag class="indicator_version" effect="dark" :type="indicator.indicatorState | statusFilter"
                        style="margin-left: 25px; width: 50px;">{{ indicator.indicatorStateName }}</el-tag>
                </div>
            </div>
            <div class="indicator_operation">
                <div style="display: flex; flex-direction: row;">
                    <el-tag class="indicator_version" effect="plain" type="info" style="margin-right: 10px;">查看次数 {{
                        indicator.viewsNum }}</el-tag>
                    <el-tag class="indicator_version" effect="plain" type="info" style="margin-right: 10px;">收藏次数 {{
                        indicator.favoursNum }}</el-tag>
                    <el-tag class="indicator_version" effect="plain" type="info">订阅次数 0</el-tag>
                </div>
                <div style="margin-top: auto;">
                    <el-button v-if="indicator.isCollect == false" icon="el-icon-star-off" type="primary" size="mini"
                        @click="handleFavour()" plain>添加收藏</el-button>
                    <el-button v-if="indicator.isCollect == true" icon="el-icon-star-on" type="warning" size="mini"
                        @click="handleCancleFavour()" plain>已收藏</el-button>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit()">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="handelDelete" :disabled="indicator.quoteNum > 0">删除</el-button>
                </div>
            </div>
        </div>
        <el-tabs v-model="activeName" type="card" style="margin-top: 15px;">
            <el-tab-pane label="详细信息" name="detailInformation">
                <el-collapse v-model="collapseName" class="indicator_collapse">
                    <el-collapse-item title="基本信息" name="baseInformation">
                        <el-descriptions class="margin-top" :column="4">
                            <el-descriptions-item label="指标标识" :span="4">{{ this.indicator.indicatorId
                            }}</el-descriptions-item>
                            <el-descriptions-item label="指标名称" :span="4">{{ this.indicator.indicatorName
                            }}</el-descriptions-item>
                            <el-descriptions-item
                                v-if="this.indicator.indicatorType == 2 || this.indicator.indicatorType == 3"
                                label="依赖的主原子指标" :span="4">{{ indicator.dependentIndicatorName }}</el-descriptions-item>
                            <el-descriptions-item v-if="this.indicator.indicatorType == 2" label="衍生词" :span="4">{{
                                indicator.derivationNames.join(",") }}</el-descriptions-item>
                            <el-descriptions-item v-if="this.indicator.indicatorType == 3" label="修饰词" :span="4">{{
                                indicator.modifierNames.join(",") }}</el-descriptions-item>
                            <el-descriptions-item v-if="this.indicator.indicatorType == 3" label="时间周期" :span="4">{{
                                indicator.timeCycleName }}</el-descriptions-item>
                            <el-descriptions-item v-if="this.indicator.indicatorType == 4" label="运算指标" :span="4">{{
                                indicator.compositedNames.join(",") }}</el-descriptions-item>
                            <el-descriptions-item v-if="this.indicator.indicatorType == 4" label="运算规则" :span="4">{{
                                indicator.calculateRule }}</el-descriptions-item>
                            <el-descriptions-item label="创建者" :span="2">{{ this.indicator.creatorName
                            }}</el-descriptions-item>
                            <el-descriptions-item label="最后操作者" :span="2">{{ this.indicator.lastOperatorName
                            }}</el-descriptions-item>
                            <el-descriptions-item label="创建时间" :span="2">{{ this.indicator.createTime
                            }}</el-descriptions-item>
                            <el-descriptions-item label="最后更新时间" :span="2">{{ this.indicator.lastOperateTime
                            }}</el-descriptions-item>
                            <el-descriptions-item label="可分析维度" :span="4">{{ this.indicator.analyzableDimensions
                            }}</el-descriptions-item>
                            <el-descriptions-item label="关联报表连接" :span="4">{{ this.indicator.affiliatedReportLinks
                            }}</el-descriptions-item>
                        </el-descriptions>
                    </el-collapse-item>
                    <el-collapse-item title="口径信息" name="caliberDefinition">
                        <el-descriptions class="margin-top" :column="4">
                            <el-descriptions-item label="业务口径" :span="2">{{ this.indicator.businessCaliber
                            }}</el-descriptions-item>
                            <el-descriptions-item label="业务口径负责人" :span="2">{{ this.indicator.businessCaliberLeader
                            }}</el-descriptions-item>
                            <el-descriptions-item label="技术口径" :span="2">{{ this.indicator.technicalCaliber
                            }}</el-descriptions-item>
                            <el-descriptions-item label="实时技术口径" :span="2">{{ this.indicator.realtimeTechnicalCaliber
                            }}</el-descriptions-item>
                            <el-descriptions-item label="技术口径负责人" :span="2">{{ this.indicator.technicalCaliberLeader
                            }}</el-descriptions-item>
                            <el-descriptions-item label="主管部门" :span="2">{{ this.indicator.competentAuthoritie }}
                            </el-descriptions-item>
                        </el-descriptions>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="版本历史" name="historyVersion">
                <el-timeline>
                    <el-timeline-item v-for="version of versions"
                        :timestamp="version.operateTime[0] + ' v' + version.versionNum" placement="top">
                        <el-card style="width: 550px;">
                            <pre class="custom-pre">{{ version.operation }}</pre>
                            <p>{{ version.operatorName }} 提交于 {{ version.operateTime[0] + " " + version.operateTime[1] }}
                            </p>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-tab-pane>
            <el-tab-pane label="指标血缘" name="third">
                <svgTable :indicatorId="indicatorId"></svgTable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import svgTable from './components/svg-table.vue';
import { getIndicatorDetail, deleteIndicator } from '@/api/dictionary';
import { getVersionList } from '@/api/version';
import { parseTime } from '@/utils';
import { addCollection, deleteCollection } from '@/api/user'

export default {
    components: {
        svgTable,
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                1: '',
                2: 'info',
                3: 'success',
                4: 'warning',
            }
            return statusMap[status]
        },

    },
    data() {
        return {
            activeName: 'detailInformation',
            collapseName: ['baseInformation', 'caliberDefinition'],
            indicator: {
                indicatorId: '',
                indicatorName: '',
                indicatorType: '',
                indicatorTypeName: '',
                indicatorDesc: '',
                dependentIndicatorId: '',
                dependentIndicatorName: '',
                derivationIds: [],
                derivationNames: [],
                modifierIds: [],
                modifierNames: [],
                timeCycleId: '',
                timeCycleName: '',
                compositedIds: [],
                compositedNames: [],
                calculateRule: '',
                creatorId: '',
                creatorName: '',
                lastOperatorId: '',
                lastOperatorName: '',
                createTime: '',
                lastOperateTime: '',
                analyzableDimensions: '',
                affiliatedReportLinks: '',
                businessCaliber: '',
                businessCaliberLeader: '',
                technicalCaliber: '',
                realtimeTechnicalCaliber: '',
                technicalCaliberLeader: '',
                competentAuthoritie: '',
                version: {
                    versionNum: '',
                    versionDesc: '',
                    operation: '',
                    operatorId: '',
                    operatorName: '',
                    operateTime: '',
                }
            },
            indicatorId: this.$route.query.indicatorId,
            versions: undefined,
        };
    },
    created() {
        this.getIndicator();
        this.getVersions();
    },
    methods: {
        /**
         * @description: 获取指标详情信息
         * @return {*}
         * @author: wch
         */
        getIndicator() {
            getIndicatorDetail({ indicatorId: this.indicatorId }).then(res => {
                this.indicator = res.data.indicator;
                this.indicator.createTime = new Date(this.indicator.createTime)
                this.indicator.createTime = parseTime(this.indicator.createTime, '{y}-{m}-{d} {h}:{i}')
                this.indicator.lastOperateTime = new Date(this.indicator.lastOperateTime)
                this.indicator.lastOperateTime = parseTime(this.indicator.lastOperateTime, '{y}-{m}-{d} {h}:{i}')
            }).catch(error => {
                console.log(error);
            });
        },
        /**
         * @description: 获取指标版本信息
         * @return {*}
         * @author: wch
         */
        getVersions() {
            getVersionList({ indicatorId: this.indicatorId }).then(res => {
                this.versions = res.data.versions;
                for (let i = 0; i < this.versions.length; i++) {
                    this.versions[i].operateTime = new Date(this.versions[i].operateTime)
                    this.versions[i].operateTime = parseTime(this.versions[i].operateTime, '{y}-{m}-{d} {h}:{i}')
                    this.versions[i].operateTime = this.versions[i].operateTime.split(' ')
                }
            }).catch(error => {
                console.log(error);
            });
        },
        parseTime(date, format) {
            parseTime(date, format)
        },
        /**
         * @description: 收藏指标
         * @return {*}
         * @author: wch
         */
        handleFavour() {
            addCollection({ indicatorId: this.indicatorId }).then(response => {
                if (response.success) {
                    this.$set(this.indicator, 'isCollect', true)
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
                }
            })
        },
        /**
         * @description: 取消收藏指标
         * @return {*}
         * @author: wch
         */
        handleCancleFavour() {
            deleteCollection({ indicatorId: this.indicatorId }).then(response => {
                if (response.success) {
                    this.$set(this.indicator, 'isCollect', false)
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
                }
            })
        },
        handelDelete(){
            deleteIndicator({ indicatorId: this.indicatorId }).then(response => {
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
                }
            })
        },
        handleEdit() {
            this.$router.push({ path: '/indicator/dictionary/edit', query: { indicatorId: this.indicatorId } })
        },
    }
};
</script>

<style lang="css">
.indicator_collapse .el-collapse-item__arrow {
    margin-right: 15px;
    font-size: 8px;
    color: #0164fe;

    &:before {
        content: '\e620';
        font-size: 8px;
        font-style: normal;
        color: #0164fe;
        margin-right: 20px;
    }
}

.indicator_collapse .el-collapse-item__arrow.is-active {
    transform: rotate(90deg);
    margin-top: 14px;
    margin-left: -6px;
    margin-right: 10px;
}

.indicator_collapse .collapse-title {
    height: 40px !important;
    line-height: 40px;
    flex: 1 0 90%;
    order: 1;
    justify-content: space-between;
}

.indicator_collapse .el-collapse-item__header {
    height: 40px !important;
    flex: 1 0 auto;
    order: -1;
    background: #e7efff;
    padding: 0 20px;
    border-bottom: 1px solid #ffffff;
    font-size: 16px;
    font-weight: 600;
}

.indicator_collapse .collapse-title-right {
    span {
        color: #0e64f1;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
}

.indicator_collapse .el-collapse-item__content {
    padding: 20px;
}

.indicator_collapse .el-collapse-item__wrap {
    border: none;
}

.custom-pre {
    display: block;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-family: Arial, sans-serif;
}

.margin-top .el-descriptions-item__container {
    font-size: 14px;
    color: #000;
    font-weight: 500;
}

.indicator_icon_container {
    width: 80px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin-top: 20px;
}

.indicator_icon_container .el-icon-picture {
    font-size: 40px;
    color: #fff;
    background-color: cadetblue;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 100%;
    height: 75%;
    border: 1px solid #999;
}

.indicator_icon_container .indicator_type {
    font-size: 12px;
    color: rgb(125, 125, 125);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    border-bottom: 1px solid #999;
    border-left: 1px solid #999;
    border-right: 1px solid #999;
}

.indicator_version {
    padding: 0px;
    line-height: 20px;
    border-radius: 0px;
    height: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.indicator_operation {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: auto;
}

.indicator_operation .indicator_version {
    width: 90px;
    height: 22px;
    justify-content: center;
    align-items: center;
    background-color: #eee;
}

.el-tabs--card>.el-tabs__header {
    border-bottom: 1px solid #ccc;
}

.el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: 1px solid #ccc;
    border-bottom: none;
}

.el-tabs--card>.el-tabs__header .el-tabs__item {
    border-left: 1px solid #ccc;
}

.el-card__body {
    padding-top: 0px;
    padding-bottom: 5px;
}

.svg {
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 550px;
}
</style>