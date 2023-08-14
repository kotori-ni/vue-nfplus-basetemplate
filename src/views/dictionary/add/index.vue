<!--
 * @Description: 指标管理->添加指标
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-21 10:56:30
 * @LastEditors: wch
 * @LastEditTime: 2023-08-14 15:08:48
-->

<template>
	<div>
		<el-form ref="form" :rules="formRules" :model="formData" size="small" label-width="auto" class="addForm">
			<el-collapse v-model="tableNames">
				<el-collapse-item title="基本信息" name="baseInformation">
					<el-form-item label="指标类型" prop="indicatorType">
						<el-radio-group v-model="formData.indicatorType" @change="handleIndicatorTypeChange">
							<el-radio label=1>主原子指标</el-radio>
							<el-radio label=2>衍生原子指标</el-radio>
							<el-radio label=3>派生指标</el-radio>
							<el-radio label=4>复合指标</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if="formData.indicatorType == 2 || formData.indicatorType == 3" label="依赖的原子指标"
						prop="dependentIndicatorId">
						<el-select v-model="formData.dependentIndicatorId" filterable placeholder="请选择依赖的主原子指标"
							style="width: 100%;">
							<el-option v-for="item in atomicIndicators" :key="item.indicatorId" :label="item.indicatorName"
								:value="item.indicatorId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="formData.indicatorType == 2" label="衍生词" prop="derivations">
						<el-select v-model="formData.derivations" multiple :multiple-limit="5" filterable
							default-first-option placeholder="请选择衍生词" style="width: 100%;" clearable>
							<el-option v-for="item in derivations" :key="item.derivationId" :label="item.derivationName"
								:value="item.derivationId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="formData.indicatorType == 3" label="时间周期" prop="timeCycles">
						<el-select v-model="formData.timeCycleId" filterable default-first-option placeholder="请选择时间周期"
							style="width: 100%;">
							<el-option v-for="item in timeCycles" :key="item.timeCycleId" :label="item.timeCycleName"
								:value="item.timeCycleId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="formData.indicatorType == 3" label="修饰词" prop="modifiers">
						<el-cascader v-model="formData.modifiers" clearable :props="{ multiple: true }" filterable
							:multiple-limit="5" :options="modifiers" style="width: 100%;" placeholder="请选择修饰词"
							:show-all-levels="false">
						</el-cascader>
					</el-form-item>
					<el-form-item label="指标名称" prop="indicatorName">
						<el-input v-model="formData.indicatorName" placeholder="1-128个字符" maxlength="128" show-word-limit />
					</el-form-item>
					<el-form-item label="指标标识" prop="indicatorId">
						<el-input v-model="formData.indicatorId" placeholder="1-128个字符 不可重复" maxlength="128"
							show-word-limit />
					</el-form-item>
					<el-form-item v-if="formData.indicatorType == 4" label="依赖指标" prop="compositeds">
						<el-select v-model="formData.compositeds" multiple :multiple-limit="10" filterable
							default-first-option placeholder="请选择参与复合指标运算的指标" style="width: 100%;">
							<el-option v-for="item in compositeds" :key="item.indicatorId" :label="item.indicatorName"
								:value="item.indicatorId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="formData.indicatorType == 4" label="运算规则" prop="calculateRule">
						<el-input v-model="formData.calculateRule" type="textarea" autosize placeholder="请输入复合指标运算规则"
							maxlength="512" show-word-limit />
					</el-form-item>
					<el-form-item label="指标域" prop="domainId">
						<el-cascader v-model="formData.domainId" ref="domain" clearable :show-all-levels="false" filterable
							:options="domains" style="width: 100%;" placeholder="请选择指标域"
							@change="handleDomainChange"></el-cascader>
					</el-form-item>
					<el-form-item label="可分析维度" prop="analyzableDimensions">
						<el-select v-model="analyzableDimensions" multiple filterable allow-create default-first-option
							placeholder="请输入分析维度 不同维度使用回车分隔" style="width: 100%;" clearable>
							<el-option v-for="item in dimensions" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="关联报表链接" prop="affiliatedReportLinks">
						<el-select v-model="affiliatedReportLinks" multiple filterable allow-create default-first-option
							placeholder="请选择关联报表链接 不同链接使用回车分隔" style="width: 100%;" clearable>
						</el-select>
					</el-form-item>
					<el-form-item label="安全级别" prop="securityLevel">
						<el-input-number v-model="formData.securityLevel" :min="1" :max="10"></el-input-number>
					</el-form-item>
				</el-collapse-item>
				<el-collapse-item title="口径定义" name="caliberDefinition">
					<el-form-item label="业务口径" prop="businessCaliber">
						<el-input v-model="formData.businessCaliber" type="textarea" autosize placeholder="请输入业务口径描述"
							maxlength="255" show-word-limit />
					</el-form-item>
					<el-form-item label="业务口径负责人" prop="businessCaliberLeader">
						<el-input v-model="formData.businessCaliberLeader" placeholder="请输入业务口径负责人" maxlength="128"
							show-word-limit />
					</el-form-item>
					<el-form-item label="技术口径" prop="technicalCaliber">
						<el-input v-model="formData.technicalCaliber" type="textarea" autosize placeholder="请输入技术口径描述"
							maxlength="255" show-word-limit />
					</el-form-item>
					<el-form-item label="实时技术口径" prop="realtimeTechnicalCaliber">
						<el-input v-model="formData.realtimeTechnicalCaliber" type="textarea" autosize
							placeholder="请输入实时技术口径负责人描述" maxlength="255" show-word-limit />
					</el-form-item>
					<el-form-item label="技术口径负责人" prop="technicalCaliberLeader">
						<el-input v-model="formData.technicalCaliberLeader" placeholder="请输入技术口径负责人" maxlength="128"
							show-word-limit />
					</el-form-item>
					<el-form-item label="主管部门" prop="competentAuthoritie">
						<el-input v-model="formData.competentAuthoritie" placeholder="请输入指标主管部门" maxlength="128"
							show-word-limit />
					</el-form-item>
				</el-collapse-item>
				<el-collapse-item title="其他信息" name="otherInformation">
				</el-collapse-item>
			</el-collapse>
			<el-form-item style="margin-top: 15px;" size="medium">
				<el-button type="primary" @click="handleSubmit">提交</el-button>
				<el-button type="info" @click="dialogVisible = true">保存为草稿</el-button>
				<el-button type="info" @click="handleReset">重置</el-button>
			</el-form-item>
		</el-form>

		<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
			<span>保存为草稿会将指标状态设为 [草稿] ,您可以在 [我的数据] 页面中继续编辑该指标</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false" size="medium">返回</el-button>
				<el-button type="primary" @click="handleSave" size="medium">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { getIndicatorList, addIndicator } from '@/api/dictionary.js';
import { getModifierList } from '@/api/modifier.js';
import { getDerivationList } from '@/api/derivation.js';
import { getTimeCycleList } from '@/api/timecycle.js';
import { getAllDomainList } from '@/api/domain.js';

export default {
	data() {
		return {
			tableNames: ['baseInformation', 'caliberDefinition'],
			domains: [],
			dimensions: [],
			derivations: [],
			dialogVisible: false,
			atomicIndicators: [],
			analyzableDimensions: [],
			affiliatedReportLinks: [],
			compositeds: [],
			modifiers: [],
			timeCycles: [],
			indicatorSearchQuery: {
				page: 1,
				pageSize: 10,
				needPage: false,
				indicatorType: 0,
			},
			derivationSearchQuery: {
				page: 1,
				pagesize: 10,
				needpage: false,
				allmessage: false,
			},
			formData: {
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
				timeCycle: undefined,
				modifiers: [],
				compositeds: [],
				calculateRule: undefined,
			},
			formRules: {
				indicatorType: [
					{ required: true, message: '请选择指标类型', trigger: 'change' }
				],
				dependentIndicatorId: [
					{ required: true, message: '请选择依赖的主原子指标', trigger: 'change' }
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
		this.getDomains(false, true);
		this.getIndicators();
		this.getDerivations();
		this.getTimeCycles(true);
		this.getModifiers(false, true);
	},
	methods: {
		/**
		 * @description: 重置指标表单数据
		 * @return {*}
		 * @author: wch
		 */
		resetFromData() {
			this.formData = {
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
			}
			this.formData.domainId = 0;
			this.analyzableDimensions = [];
			this.affiliatedReportLinks = [];
		},
		/**
		 * @description: 获取所有指标域
		 * @param {*} needAll 是否需要"全部"这个结点
		 * @param {*} allowParent 父节点是否可选
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
		 * @return {*}
		 * @author: wch
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
		 * @param {*} needAll 是否需要"全部"这个结点
		 * @param {*} allowParent 父节点是否可选
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
		 * @description: 添加指标
		 * @return {*}
		 * @author: wch
		 */
		addIndicator() {
			this.$refs['form'].validate((valid) => {
				if (valid) {
					if (this.analyzableDimensions != null) {
						this.formData.analyzableDimensions = this.analyzableDimensions.join(',');
						this.analyzableDimensions = [];
					}
					if (this.affiliatedReportLinks != null) {
						this.formData.affiliatedReportLinks = this.affiliatedReportLinks.join(',');
						this.affiliatedReportLinks = [];
					}

					addIndicator(this.formData).then(response => {
						if (response.success) {
							this.$notify({
								title: '操作成功',
								message: response.message,
								type: 'success',
								duration: 2000
							})
							this.resetFromData();
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
		handleIndicatorTypeChange(val) {
			this.resetFromData()
			this.formData.indicatorType = val;
		},
		handleDomainChange() {
			this.formData.domainId = this.$refs.domain.getCheckedNodes()[0].value;
		},
		handleSubmit() {
			this.formData.indicatorState = 3;
			this.addIndicator();
		},
		handleSave() {
			this.dialogVisible = false;
			this.formData.indicatorState = 2;
			this.addIndicator();
		},
		handleReset() {
			var type = this.formData.indicatorType;
			this.resetFromData();
			this.formData.indicatorType = type;
		},
	}
}
</script>

<style>
.addForm {
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