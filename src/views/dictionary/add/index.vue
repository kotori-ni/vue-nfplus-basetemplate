<template>
	<div>
		<el-form ref="form" :rules="form_rules" :model="form_data" size="small" label-width="auto" class="add_form">
			<el-collapse v-model="tableNames">
				<el-collapse-item title="基本信息" name="base_information">
					<el-form-item label="指标类型" prop="indicator_type">
						<el-radio-group v-model="form_data.indicator_type" @change="handleIndicatorTypeChange">
							<el-radio label=1>主原子指标</el-radio>
							<el-radio label=2>衍生原子指标</el-radio>
							<el-radio label=3>派生指标</el-radio>
							<el-radio label=4>复合指标</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if="form_data.indicator_type == 2 || form_data.indicator_type == 3" label="依赖的原子指标"
						prop="dependent_indicator_id">
						<el-select v-model="form_data.dependent_indicator_id" filterable placeholder="请选择依赖的主原子指标"
							style="width: 100%;">
							<el-option v-for="item in atomic_indicators" :key="item.indicator_id"
								:label="item.indicator_name" :value="item.indicator_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="form_data.indicator_type == 2" label="衍生词" prop="derivation_ids">
						<el-select v-model="form_data.derivation_ids" multiple :multiple-limit="5" filterable
							default-first-option placeholder="请选择衍生词" style="width: 100%;" clearable>
							<el-option v-for="item in derivations" :key="item.derivation_id" :label="item.derivation_name"
								:value="item.derivation_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="form_data.indicator_type == 3" label="时间周期" prop="time_cycles">
						<el-select v-model="form_data.time_cycle_id" filterable default-first-option placeholder="请选择时间周期"
							style="width: 100%;">
							<el-option v-for="item in time_cycles" :key="item.time_cycle_id" :label="item.name"
								:value="item.time_cycle_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="form_data.indicator_type == 3" label="修饰词" prop="motifiers">
						<el-cascader v-model="form_data.modifier_ids" clearable :props="{ multiple: true }" filterable
							:options="modifiers" style="width: 100%;" placeholder="请选择修饰词" :show-all-levels="false">
						</el-cascader>
					</el-form-item>
					<el-form-item label="指标名称" prop="indicator_name">
						<el-input v-model="form_data.indicator_name" placeholder="1-128个字符" maxlength="128"
							show-word-limit />
					</el-form-item>
					<el-form-item label="指标标识" prop="indicator_id">
						<el-input v-model="form_data.indicator_id" placeholder="1-128个字符 不可重复" maxlength="128"
							show-word-limit />
					</el-form-item>
					<el-form-item v-if="form_data.indicator_type == 4" label="依赖指标" prop="composited_ids">
						<el-select v-model="form_data.composited_ids" multiple :multiple-limit="10" filterable
							default-first-option placeholder="请选择参与复合指标运算的指标" style="width: 100%;">
							<el-option v-for="item in composited_ids" :key="item.indicator_id" :label="item.indicator_name"
								:value="item.indicator_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="form_data.indicator_type == 4" label="运算规则" prop="calculate_rule">
						<el-input v-model="form_data.calculate_rule" type="textarea" autosize placeholder="请输入复合指标运算规则"
							maxlength="512" show-word-limit />
					</el-form-item>
					<el-form-item label="指标域" prop="domain_id">
						<el-cascader v-model="form_data.domain_id" ref="domain" clearable :show-all-levels="false"
							filterable :options="domains" style="width: 100%;" placeholder="请选择指标域"
							@change="handleDomainChange"></el-cascader>
					</el-form-item>
					<el-form-item label="可分析维度" prop="analyzable_dimensions">
						<el-select v-model="analyzable_dimensions" multiple filterable allow-create default-first-option
							placeholder="请输入分析维度 不同维度使用回车分隔" style="width: 100%;" clearable>
							<el-option v-for="item in dimensions" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="关联报表链接" prop="affiliated_report_links">
						<el-select v-model="affiliated_report_links" multiple filterable allow-create default-first-option
							placeholder="请选择关联报表链接 不同链接使用回车分隔" style="width: 100%;" clearable>
						</el-select>
					</el-form-item>
					<el-form-item label="安全级别" prop="security_level">
						<el-input-number v-model="form_data.security_level" :min="1" :max="10"></el-input-number>
					</el-form-item>
				</el-collapse-item>
				<el-collapse-item title="口径定义" name="caliber_definition">
					<el-form-item label="业务口径" prop="business_caliber">
						<el-input v-model="form_data.business_caliber" type="textarea" autosize placeholder="请输入业务口径描述"
							maxlength="255" show-word-limit />
					</el-form-item>
					<el-form-item label="业务口径负责人" prop="business_caliber_leader">
						<el-input v-model="form_data.business_caliber_leader" placeholder="请输入业务口径负责人" maxlength="128"
							show-word-limit />
					</el-form-item>
					<el-form-item label="技术口径" prop="technical_caliber">
						<el-input v-model="form_data.technical_caliber" type="textarea" autosize placeholder="请输入技术口径描述"
							maxlength="255" show-word-limit />
					</el-form-item>
					<el-form-item label="实时技术口径" prop="realtime_technical_caliber">
						<el-input v-model="form_data.realtime_technical_caliber" type="textarea" autosize
							placeholder="请输入实时技术口径负责人描述" maxlength="255" show-word-limit />
					</el-form-item>
					<el-form-item label="技术口径负责人" prop="technical_caliber_leader">
						<el-input v-model="form_data.technical_caliber_leader" placeholder="请输入技术口径负责人" maxlength="128"
							show-word-limit />
					</el-form-item>
					<el-form-item label="主管部门" prop="competent_authoritie">
						<el-input v-model="form_data.competent_authoritie" placeholder="请输入指标主管部门" maxlength="128"
							show-word-limit />
					</el-form-item>
				</el-collapse-item>
				<el-collapse-item title="其他信息" name="other_information">
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
import { getDerivativeList } from '@/api/deriver.js';
import { getTimeCycleList } from '@/api/timecycle.js';
import { getAllDomainList } from '@/api/domain.js';

export default {
	data() {
		return {
			tableNames: ['base_information', 'caliber_definition'],
			domains: [],
			dimensions: [],
			derivations: [],
			dialogVisible: false,
			atomic_indicators: [],
			analyzable_dimensions: [],
			affiliated_report_links: [],
			composited_ids: [],
			modifiers: [],
			time_cycles: [],
			search_query: {
				page: 1,
				pagesize: 10,
				needpage: false,
				indicator_type: 0,
				allmessage: false,
				neddrecord: false,
			},
			form_data: {
				indicator_type: "1",
				indicator_name: undefined,
				indicator_id: undefined,
				domain_id: undefined,
				analyzable_dimensions: undefined,
				affiliated_report_links: undefined,
				security_level: 1,
				business_caliber: undefined,
				business_caliber_leader: undefined,
				technical_caliber: undefined,
				realtime_technical_caliber: undefined,
				technical_caliber_leader: undefined,
				competent_authoritie: undefined,
				dependent_indicator_id: undefined,
				derivation_ids: [],
				time_cycle: undefined,
				modifier_ids: [],
				composited_ids: [],
				calculate_rule: undefined,
			},
			form_rules: {
				indicator_type: [
					{ required: true, message: '请选择指标类型', trigger: 'change' }
				],
				dependent_indicator_id: [
					{ required: true, message: '请选择依赖的主原子指标', trigger: 'change' }
				],
				derivation_ids: [
					{ required: true, message: '请选择衍生词', trigger: 'change' }
				],
				indicator_name: [
					{ required: true, message: '请输入指标名称', trigger: 'blur' },
					{ min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
				],
				indicator_id: [
					{ required: true, message: '请输入指标标识', trigger: 'blur' },
					{ min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
				],
				composited_ids: [
					{ required: true, message: '请选择参与复合指标运算的指标', trigger: 'change' }
				],
				calculate_rule: [
					{ required: true, message: '请输入复合指标运算规则', trigger: 'blur' },
					{ min: 1, max: 512, message: '长度在 1 到 512 个字符', trigger: 'blur' }
				],
				domain_id: [
					{ required: true, message: '请选择指标域', trigger: 'change' }
				],
				business_caliber: [
					{ required: true, message: '请输入业务口径', trigger: 'blur' },
					{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
				],
				business_caliber_leader: [
					{ required: true, message: '请输入业务口径负责人', trigger: 'blur' },
					{ min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
				],
			}
		}
	},
	mounted() {
		this.getDomains(false, true);
		this.getIndicators();
		this.getDerivations(true);
		this.getTimeCycles(true);
		this.getModifiers(false, true);
	},
	methods: {
		onSubmit() {
			console.log(this.form_data);
		},
		resetFromData() {
			this.form_data = {
				indicator_type: "1",
				indicator_name: undefined,
				indicator_id: undefined,
				domain_id: undefined,
				analyzable_dimensions: undefined,
				affiliated_report_links: undefined,
				security_level: 1,
				business_caliber: undefined,
				business_caliber_leader: undefined,
				technical_caliber: undefined,
				realtime_technical_caliber: undefined,
				technical_caliber_leader: undefined,
				competent_authoritie: undefined,
				dependency_indicator_id: undefined,
				derivation_ids: [],
				time_cycle_id: undefined,
				modifier_ids: [],
				composited_ids: [],
				calculate_rule: undefined,
			}
			this.form_data.domain_id = 0;
			this.analyzable_dimensions = [];
			this.affiliated_report_links = [];
		},
		getDomains(needAll, allowParent) {
			getAllDomainList({ needAll: needAll, allowParent: allowParent }).then(response => {
				this.domains = response.data.domains;
			}).catch(error => {
				console.log(error);
			});
		},
		getIndicators() {
			this.search_query.indicator_type = 0;
			getIndicatorList(this.search_query).then(response => {
				this.composited_ids = response.data.indicators.filter(indicator => indicator.indicator_type != 4);
				this.atomic_indicators = response.data.indicators.filter(indicator => indicator.indicator_type == 1);
			}).catch(error => {
				console.log(error);
			});
		},
		getDerivations(is_simple) {
			getDerivativeList({ simple: is_simple }).then(response => {
				this.derivations = response.data.derivations;
			}).catch(error => {
				console.log(error);
			});
		},
		getTimeCycles(is_simple) {
			getTimeCycleList({ is_simple: is_simple }).then(response => {
				this.time_cycles = response.data.time_cycles;
			}).catch(error => {
				console.log(error);
			});
		},
		getModifiers(needAll, allowParent) {
			getModifierList({ needAll: needAll, allowParent: allowParent }).then(response => {
				this.modifiers = response.data.modifiers;
			}).catch(error => {
				console.log(error);
			});
		},
		addIndicator() {
			this.$refs['form'].validate((valid) => {
				if (valid) {
					if (this.analyzable_dimensions != null)
						this.form_data.analyzable_dimensions = this.analyzable_dimensions.join(',');
					if (this.affiliated_report_links != null)
						this.form_data.affiliated_report_links = this.affiliated_report_links.join(',');

					addIndicator(this.form_data).then(response => {
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
			this.form_data.indicator_type = val;
		},
		handleDomainChange() {
			this.form_data.domain_id = this.$refs.domain.getCheckedNodes()[0].value;
		},
		handleSubmit() {
			this.form_data.indicator_state = 3;
			console.log(this.form_data)
			this.addIndicator();
		},
		handleSave() {
			this.dialogVisible = false;
			this.form_data.indicator_state = 2;
			this.addIndicator();
		},
		handleReset() {
			var type = this.form_data.indicator_type;
			this.resetFromData();
			this.form_data.indicator_type = type;
		},
	}
}
</script>

<style>
.add_form {
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