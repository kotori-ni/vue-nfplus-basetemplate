<!--
 * @Description: 指标管理->编辑指标
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-21 10:57:04
 * @LastEditors: wch
 * @LastEditTime: 2023-08-14 15:04:44
-->

<template>
	<div>
		<el-form ref="form" :rules="formRules" :model="newIndicator" size="small" label-width="auto" class="editForm">
			<el-collapse v-model="tableNames">
				<el-collapse-item title="基本信息" name="baseInformation">
					<el-form-item label="指标类型" prop="indicatorType">
						<el-radio-group v-model="oldIndicator.indicatorType" disabled>
							<el-radio label=1>主原子指标</el-radio>
							<el-radio label=2>衍生原子指标</el-radio>
							<el-radio label=3>派生指标</el-radio>
							<el-radio label=4>复合指标</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if="oldIndicator.indicatorType == 2 || oldIndicator.indicatorType == 3" label="依赖的原子指标"
						prop="dependentIndicatorId">
						<el-select v-model="newIndicator.dependentIndicatorId" filterable placeholder="请选择依赖的主原子指标"
							style="width: 100%;">
							<el-option v-for="item in atomicIndicators" :key="item.indicatorId" :label="item.indicatorName"
								:value="item.indicatorId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="oldIndicator.indicatorType == 2" label="衍生词" prop="derivations">
						<el-select v-model="newIndicator.derivations" multiple :multiple-limit="5" filterable
							default-first-option placeholder="请选择衍生词" style="width: 100%;">
							<el-option v-for="item in derivations" :key="item.derivationId" :label="item.derivationName"
								:value="item.derivationId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="oldIndicator.indicatorType == 3" label="时间周期" prop="timeCycles">
						<el-select v-model="newIndicator.timeCycleId" filterable default-first-option placeholder="请选择时间周期"
							style="width: 100%;" clearable>
							<el-option v-for="item in timeCycles" :key="item.timeCycleId" :label="item.timeCycleName"
								:value="item.timeCycleId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="oldIndicator.indicatorType == 3" label="修饰词" prop="motifiers">
						<el-cascader v-model="newIndicator.modifiers" clearable :props="{ multiple: true }" filterable
							:options="modifiers" style="width: 100%;" placeholder="请选择修饰词" :show-all-levels="false">
						</el-cascader>
					</el-form-item>
					<el-form-item label="指标名称" prop="indicatorName">
						<el-input v-model="newIndicator.indicatorName" placeholder="1-128个字符" maxlength="128"
							show-word-limit />
					</el-form-item>
					<el-form-item label="指标标识" prop="indicatorId">
						<el-input v-model="newIndicator.indicatorId" placeholder="1-128个字符 不可重复" maxlength="128"
							show-word-limit disabled />
					</el-form-item>
					<el-form-item v-if="oldIndicator.indicatorType == 4" label="依赖指标" prop="compositeds">
						<el-select v-model="newIndicator.compositeds" multiple :multiple-limit="10" filterable
							default-first-option placeholder="请选择参与复合指标运算的指标" style="width: 100%;">
							<el-option v-for="item in compositeds" :key="item.indicatorId" :label="item.indicatorName"
								:value="item.indicatorId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="oldIndicator.indicatorType == 4" label="运算规则" prop="calculateRule">
						<el-input v-model="newIndicator.calculateRule" type="textarea" autosize placeholder="请输入复合指标运算规则"
							maxlength="512" show-word-limit />
					</el-form-item>
					<el-form-item label="指标域" prop="domainId">
						<el-cascader v-model="newIndicator.domainId" ref="domain" clearable :show-all-levels="false"
							filterable :options="domains" style="width: 100%;" placeholder="请选择指标域"
							@change="handleDomainChange"></el-cascader>
					</el-form-item>
					<el-form-item label="可分析维度" prop="analyzableDimensions">
						<el-select v-model="newIndicator.analyzableDimensions" multiple filterable allow-create
							default-first-option placeholder="请输入分析维度 不同维度使用回车分隔" style="width: 100%;">
							<el-option v-for="item in dimensions" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="关联报表链接" prop="affiliatedReportLinks">
						<el-select v-model="newIndicator.affiliatedReportLinks" multiple filterable allow-create
							default-first-option placeholder="请输入关联报表链接 不同链接使用回车分隔" style="width: 100%;" clearable>
						</el-select>
					</el-form-item>
					<el-form-item label="安全级别" prop="securityLevel">
						<el-input-number v-model="newIndicator.securityLevel" :min="1" :max="10"></el-input-number>
					</el-form-item>
				</el-collapse-item>
				<el-collapse-item title="口径定义" name="caliberDefinition">
					<el-form-item label="业务口径" prop="businessCaliber">
						<el-input v-model="newIndicator.businessCaliber" type="textarea" autosize placeholder="请输入业务口径描述"
							maxlength="255" show-word-limit />
					</el-form-item>
					<el-form-item label="业务口径负责人" prop="businessCaliberLeader">
						<el-input v-model="newIndicator.businessCaliberLeader" placeholder="请输入业务口径负责人" maxlength="128"
							show-word-limit />
					</el-form-item>
					<el-form-item label="技术口径" prop="technicalCaliber">
						<el-input v-model="newIndicator.technicalCaliber" type="textarea" autosize placeholder="请输入技术口径描述"
							maxlength="255" show-word-limit />
					</el-form-item>
					<el-form-item label="实时技术口径" prop="realtimeTechnicalCaliber">
						<el-input v-model="newIndicator.realtimeTechnicalCaliber" type="textarea" autosize
							placeholder="请输入实时技术口径负责人描述" maxlength="255" show-word-limit />
					</el-form-item>
					<el-form-item label="技术口径负责人" prop="technicalCaliberLeader">
						<el-input v-model="newIndicator.technicalCaliberLeader" placeholder="请输入技术口径负责人" maxlength="128"
							show-word-limit />
					</el-form-item>
					<el-form-item label="主管部门" prop="competentAuthoritie">
						<el-input v-model="newIndicator.competentAuthoritie" placeholder="请输入指标主管部门" maxlength="128"
							show-word-limit />
					</el-form-item>
				</el-collapse-item>
				<el-collapse-item title="其他信息" name="otherInformation">
				</el-collapse-item>
			</el-collapse>
			<el-form-item style="margin-top: 15px;" size="medium">
				<el-button type="primary" @click="handleSubmit">发布</el-button>
				<el-button v-if="newIndicator.indicatorState != 2" type="info"
					@click="dialogVisible = true">保存为草稿</el-button>
				<el-button v-if="newIndicator.indicatorState == 2" type="info" @click="handleSave">保存</el-button>
				<el-button type="info" @click="handleReset">重置</el-button>
			</el-form-item>
		</el-form>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
			<span>保存为草稿会下线已发布的指标，并将指标状态设为 [草稿] ，您可以在 [我的数据] 页面中继续编辑该指标</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false" size="medium">返回</el-button>
				<el-button type="primary" @click="handleSave" size="medium">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
  
<script>
import { getIndicatorList, getIndicatorDetail, updateIndicator, changeState } from '@/api/dictionary.js';
import { getModifierList } from '@/api/modifier.js';
import { getDerivationList } from '@/api/derivation.js';
import { getTimeCycleList } from '@/api/timecycle.js';
import { getAllDomainList } from '@/api/domain.js';

export default {
	data() {
		return {
			oldIndicatorId: this.$route.query.indicatorId,
			dialogVisible: false,
			oldIndicator: {
				indicatorType: "1",
				indicatorName: undefined,
				indicatorId: undefined,
				domainId: undefined,
				analyzableDimensions: undefined,
				affiliatedReportLinks: undefined,
				securityLevel: 1,
				businessCaliber: undefined,
				businessCaliberLeader: undefined,
				technicalCaliber: undefined,
				realtimeTechnicalCaliber: undefined,
				technicalCaliberLeader: undefined,
				competentAuthoritie: undefined,
				dependentIndicatorId: undefined,
				derivations: [],
				timeCycleId: undefined,
				modifiers: [],
				compositeds: [],
				calculateRule: undefined,
			},
			newIndicator: {
				indicatorType: "1",
				indicatorName: undefined,
				indicatorId: undefined,
				domainId: undefined,
				analyzableDimensions: undefined,
				affiliatedReportLinks: undefined,
				securityLevel: 1,
				businessCaliber: undefined,
				businessCaliberLeader: undefined,
				technicalCaliber: undefined,
				realtimeTechnicalCaliber: undefined,
				technicalCaliberLeader: undefined,
				competentAuthoritie: undefined,
				dependentIndicatorId: undefined,
				derivations: [],
				timeCycleId: undefined,
				modifiers: [],
				compositeds: [],
				calculateRule: undefined,
			},
			tableNames: ['baseInformation', 'caliberDefinition'],
			domains: [],
			dimensions: [],
			derivations: [],
			atomicIndicators: [],
			analyzableDimensions: [],
			compositeds: [],
			modifiers: [],
			timeCycles: [],
			indicatorSearchQuery: {
				page: 1,
				pageAize: 10,
				needPage: false,
				indicatorType: undefined,
			},
			derivationSearchQuery: {
				page: 1,
				pageSize: 10,
				needPage: false,
			},
			formRules: {
				indicatorType: [
					{ required: true, message: '请选择指标类型', trigger: 'change' }
				],
				dependentIndicatorId: [
					{ required: true, message: '请选择指标域', trigger: 'change' }
				],
				derivations: [
					{ required: true, message: '请选择衍生词', trigger: 'change' }
				],
				indicatorName: [
					{ required: true, message: '请输入指标名称', trigger: 'blur' },
					{ min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
				],
				indicatorId: [
					{ required: true, message: '请输入指标标识', trigger: 'blur' },
					{ min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
				],
				compositeds: [
					{ required: true, message: '请选择参与复合指标运算的指标', trigger: 'change' }
				],
				calculateRule: [
					{ required: true, message: '请输入复合指标运算规则', trigger: 'blur' },
					{ min: 1, max: 512, message: '长度在 1 到 512 个字符', trigger: 'blur' }
				],
				domainId: [
					{ required: true, message: '请选择指标域', trigger: 'change' }
				],
				businessCaliber: [
					{ required: true, message: '请输入业务口径', trigger: 'blur' },
					{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
				],
				businessCaliberLeader: [
					{ required: true, message: '请输入业务口径负责人', trigger: 'blur' },
					{ min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
				],
			}
		}
	},
	mounted() {
		this.getIndicator(this.$route.query.indicatorId)
		this.getDomains(false, true);
		this.getIndicators();
		this.getDerivations(true);
		this.getTimeCycles(true);
		this.getModifiers(false, true);
	},
	methods: {
		/**
		 * @description: 获取指标信息
		 * @param {*} indicatorId
		 * @return {*}
		 * @author: wch
		 */
		getIndicator(indicatorId) {
			getIndicatorDetail({ indicatorId: indicatorId }).then(res => {
				this.oldIndicator = res.data.indicator;
				if (this.oldIndicator.analyzableDimensions != null)
					this.oldIndicator.analyzableDimensions = res.data.indicator.analyzableDimensions.split(',');
				if (this.oldIndicator.affiliatedReportLinks != null)
					this.oldIndicator.affiliatedReportLinks = res.data.indicator.affiliatedReportLinks.split(',');
				this.newIndicator = this.oldIndicator;
			}).catch(error => {
				console.log(error);
			});
		},
		/**
		 * @description: 获取所有指标域
		 * @param {*} needAll
		 * @param {*} allowParent
		 * @return {*}
		 * @author: wch
		 */
		getDomains(needAll, allowParent) {
			getAllDomainList({ needAll: needAll, allowParent: allowParent }).then(response => {
				this.domains = response.data.domains;
			}).catch(error => {
				console.log(error);
			});
		},
		/**
		 * @description: 获取所有的主原子指标,和可以参与到复合指标运算中的指标
		 * @return {*}
		 * @author: wch
		 */
		getIndicators() {
			this.indicatorSearchQuery.indicatorType = 0;
			getIndicatorList(this.indicatorSearchQuery).then(response => {
				this.compositeds = response.data.indicators.filter(indicator => indicator.indicatorType != 4);
				this.atomicIndicators = response.data.indicators.filter(indicator => indicator.indicatorType == 1);
			}).catch(error => {
				console.log(error);
			});
		},
		/**
		 * @description: 获取所有衍生词
		 * @return {*}
		 * @author: wch
		 */
		getDerivations() {
			getDerivationList(this.derivationSearchQuery).then(response => {
				this.derivations = response.data.derivations;
			}).catch(error => {
				console.log(error);
			});
		},
		/**
		 * @description: 获取所有时间周期
		 * @param {*} needAll
		 * @return {*}
		 */
		getTimeCycles() {
			getTimeCycleList().then(response => {
				this.timeCycles = response.data.timecycles;
			}).catch(error => {
				console.log(error);
			});
		},
		/**
		 * @description: 获取所有修饰词
		 * @param {*} needAll
		 * @param {*} allowParent
		 * @return {*}
		 */
		getModifiers(needAll, allowParent) {
			getModifierList({ needAll: needAll, allowParent: allowParent }).then(response => {
				this.modifiers = response.data.modifiers;
			}).catch(error => {
				console.log(error);
			});
		},
		/**
		 * @description: 更新指标信息
		 * @return {*}
		 * @author: wch
		 */
		updateIndicator() {
			this.$refs['form'].validate((valid) => {
				if (valid) {
					if (Array.isArray(this.newIndicator.analyzableDimensions))
						this.newIndicator.analyzableDimensions = this.newIndicator.analyzableDimensions.join(',');
					else
						this.newIndicator.analyzableDimensions = undefined;
					if (Array.isArray(this.newIndicator.affiliatedReportLinks))
						this.newIndicator.affiliatedReportLinks = this.newIndicator.affiliatedReportLinks.join(',');
					else
						this.newIndicator.affiliatedReportLinks = undefined;
					console.log(this.newIndicator);

					updateIndicator(this.newIndicator).then(response => {
						if (response.success) {
							this.$notify({
								title: '操作成功',
								message: response.message,
								type: 'success',
								duration: 2000
							})
							this.$router.back()
						}
						else {
							this.$notify({
								title: '操作失败',
								message: response.message,
								type: 'error',
								duration: 2000
							})
							this.newIndicator.affiliatedReportLinks = []
							this.newIndicator.analyzableDimensions = []
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
		handleDomainChange() {
			this.newIndicator.domainId = this.$refs.domain.getCheckedNodes()[0].value;
		},
		handleSubmit() {
			this.newIndicator.indicatorState = 3;
			this.updateIndicator();
		},
		handleSave() {
			this.newIndicator.indicatorState = 2;
			this.updateIndicator();
		},
		handleReset() {
			this.newIndicator = {
				indicatorType: this.oldIndicator.indicatorType,
				indicatorName: undefined,
				indicatorId: this.oldIndicator.indicatorId,
				domainId: undefined,
				analyzableDimensions: undefined,
				affiliatedReportLinks: undefined,
				securityLevel: 1,
				businessCaliber: undefined,
				businessCaliberLeader: undefined,
				technicalCaliber: undefined,
				realtimeTechnicalCaliber: undefined,
				technicalCaliberLeader: undefined,
				competentAuthoritie: undefined,
				dependencyIndicatorId: undefined,
				derivations: [],
				timeCycleId: undefined,
				modifiers: [],
				compositeds: [],
				calculateRule: undefined,
			}
			this.newIndicator.domainId = 0;
			this.newIndicator.analyzableDimensions = [];
			this.newIndicator.affiliatedReportLinks = [];
		}
	}
}

</script>

<style>
.editForm {
	padding-left: 40px;
	padding-right: 60px;
	padding-top: 20px;
	padding-bottom: 20px;
}

.el-collapse-item__header {
	font-size: 16px;
	font-weight: 600;
}

.el-form-item {
	padding-left: 20px;
}
</style>