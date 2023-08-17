<!--
 * @Description: 业务限定->修饰词
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-13 10:28:16
 * @LastEditors: wch
 * @LastEditTime: 2023-08-15 17:14:14
-->


<template>
	<div class="app-container">
		<div class="filter-container" style="display: inline-block; width: 100%;">
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit"
				@click="resetModifier(); dialogAddFromVisible = true;">
				新增修饰词
			</el-button>
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="handleBatchUpload">
				批量导入
			</el-button>
			<el-button v-waves :loading="downloadLoading" class="filter-item" size="mini" type="primary"
				icon="el-icon-download" @click="dialogVisible = true">
				导出
			</el-button>
			<div style="float: right;" class="search_item">
				<el-select v-model="modifierQuery.sort" placeholder="请选择" clearable
					style="width: 120px; margin-right: 10px;">
					<el-option v-for="item in types" :key="item.key" :label="item.label" :value="item.key" />
				</el-select>
				<el-input v-model="modifierQuery.keyword" placeholder="请输入关键词" clearable style="width: 150px;"
					class="input" />
				<el-link :underline="false" style="margin-left: 10px; margin-right: 10px;"
					@click="handleResetSearchQuery">重置<i class="el-icon-setting el-icon--right"
						style="float: right;"></i></el-link>
				<el-button v-waves class="search-item" type="primary" icon="el-icon-search" @click="handleSearch"
					size="mini">
					搜索
				</el-button>
			</div>
		</div>

		<hr style="height: 1px; background-color: #ddd; margin-top: 10px; margin-bottom: 5px; border: none;" />

		<el-table :key="tableKey" :data="modifiers" border fit highlight-current-row
			style="width: 100%; margin-top: 10px; border: 1px solid #ddd;" :cell-style="tableCellStyle"
			:header-cell-style="tableHeaderCellStyle">
			<el-table-column label="ID" prop="index" align="center" width="60">
				<template slot-scope="{row}">
					<span>{{ row.index }}</span>
				</template>
			</el-table-column>
			<el-table-column label="修饰词名称" prop="modifierName" width="150" align="center">
				<template slot-scope="{row}">
					<span>{{ row.modifierName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建者" width="100" prop="creatorName" align="center">
				<template slot-scope="{row}">
					<span>{{ row.creatorName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建时间" prop="createTime" width="180" align="center">
				<template slot-scope="{row}">
					<span>{{ row.createTime }}</span>
				</template>
			</el-table-column>
			<el-table-column label="字段枚举" prop="enumeration" min-width="200" align="center">
				<template slot-scope="{row}">
					<span>{{ row.modifierValueName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="left" width="320" class-name="small-padding fixed-width">
				<template slot-scope="{row,$index}">
					<el-button size="mini" @click="handleEdit(row)">编辑</el-button>
					<el-button size="mini" @click="handleQuote(row)" type="primary">引用详情</el-button>
					<el-button size="mini" @click="handleDelete(row)" type="danger"
						:disabled="row.quoteNum > 0">删除</el-button>
					<el-button v-if="row.isCollect == false" size="mini" @click="handleFavour(row, $index)" type="success">
						收藏
					</el-button>
					<el-button v-if="row.isCollect == true" size="mini" @click="handleCancelFavour(row, $index)"
						type="warning">
						已收藏
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total >= 0" :total="total" :page.sync="modifierQuery.page" :limit.sync="modifierQuery.pageSize"
			@pagination="getmodifiers" style="height: 65px;" />

		<el-dialog title="新增修饰词" :visible.sync="dialogAddFromVisible">
			<el-form ref="addForm" :rules="rules" :model="newModifier" label-position="left" label-width="auto">
				<el-form-item label="修饰词名称" prop="modifierName">
					<el-input v-model="newModifier.modifierName" placeholder="1-64个字符" maxlength="128" show-word-limit
						autosize type="textarea" />
				</el-form-item>
				<el-form-item label="字段枚举" prop="modifierValue">
					<el-select v-model="modifierValueNames" multiple filterable allow-create default-first-option
						placeholder="请输入修饰词的所有字段取值 用回车分隔不同字段" style="width: 100%;" clearable>
					</el-select>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="newModifier.description" placeholder="1-255个字符" maxlength="255" show-word-limit
						autosize type="textarea" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleBack">返回</el-button>
				<el-button type="primary" @click="addModifier">确认添加</el-button>
			</div>
		</el-dialog>

		<el-dialog title="编辑修饰词" :visible.sync="dialogEditFromVisible">
			<el-form ref="editForm" :rules="rules" :model="existModifier" label-position="left" label-width="auto">
				<el-form-item label="修饰词名称" prop="modifierName">
					<el-input v-model="existModifier.modifierName" placeholder="1-64个字符" maxlength="128" show-word-limit
						autosize type="textarea" />
				</el-form-item>
				<el-form-item label="字段枚举" prop="modifierValue">
					<el-select v-model="modifierValueNames" multiple filterable allow-create default-first-option
						placeholder="请输入修饰词的所有字段取值 用回车分隔不同字段" style="width: 100%;" clearable>
					</el-select>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="existModifier.description" placeholder="1-255个字符" maxlength="255" show-word-limit
						autosize type="textarea" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleBack">返回</el-button>
				<el-button type="primary" @click="editModifier">确认修改</el-button>
			</div>
		</el-dialog>

		<el-dialog title="修饰词引用详情" :visible.sync="quoteVisible" width="50%">
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

		<el-dialog title="导出设定" :visible.sync="dialogVisible" width="30%">
			<span>导出本页的修饰词还是全部修饰词?</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="downloadPage">仅本页</el-button>
				<el-button type="primary" @click="downloadAll">全部</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { findModifier, addModifier, updateModifier, findQuoteIndicators, deleteModifier } from '@/api/modifier.js';
import { addCollection, deleteCollection } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
	components: { Pagination },
	directives: { waves },
	data() {
		return {
			tableKey: 0,
			total: 0,
			modifiers: undefined,
			downloadModifiers: undefined,
			downloadLoading: false,
			dialogVisible: false,
			dialogAddFromVisible: false,
			dialogEditFromVisible: false,
			quoteVisible: false,
			quoteIndicators: undefined,
			modifierValueNames: [],
			types: [{ key: "all", label: "全部" }, { key: "modifierName", label: "修饰词名称" }, { key: "creatorName", label: "创建者" }, { key: "calculationCaliber", label: "计算口径" }],
			modifierQuery: {
				page: 1,
				pageSize: 10,
				needPage: true,
				sort: undefined,
				keyword: undefined,
			},
			newModifier: {
				modifierId: undefined,
				modifierName: undefined,
				modifierValues: [],
				description: undefined,
			},
			existModifier: {
				modifierId: undefined,
				modifierName: undefined,
				modifierValues: [],
				description: undefined,
			},
			rules: {
				modifierName: [
					{ required: true, message: '请输入修饰词名称', trigger: 'blur' },
					{ min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
				],
				description: [
					{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
				],
			}
		}
	},
	mounted() {
		this.getmodifiers()
	},
	methods: {
		/**
		 * @description: 获取修饰词列表
		 * @return {*}
		 * @author: wch
		 */
		getmodifiers() {
			this.modifierQuery.needPage = true;
			if (this.modifierQuery.sort == null)
				this.modifierQuery.sort = "all"
			findModifier(this.modifierQuery).then(res => {
				this.total = res.data.modifiers.total
				this.modifiers = res.data.modifiers.records
				this.tableKey += 1
				for (let i = 0; i < this.modifiers.length; i++) {
					this.modifiers[i].createTime = parseTime(new Date(this.modifiers[i].createTime), '{y}-{m}-{d} {h}:{i}')
					this.modifiers[i].modifierValueName = []
					for (let j = 0; j < this.modifiers[i].modifierValues.length; j++) {
						this.modifiers[i].modifierValueName.push(this.modifiers[i].modifierValues[j].modifierName)
					}
					this.modifiers[i].modifierValueName = this.modifiers[i].modifierValueName.join(", ")
				}
				this.modifierQuery.sort = null;
			})
		},
		/**
		 * @description: 获取引用该修饰词的指标
		 * @param {*} row
		 * @return {*}
		 * @author: wch
		 */
		handleQuote(row) {
			findQuoteIndicators({ modifierId: row.modifierId }).then(res => {
				if (res.success) {
					this.quoteIndicators = res.data.indicators
					this.quoteVisible = true
				}
			})
		},
		handlePath(indicatorId) {
			this.$router.push({ path: '/indicator/dictionary/detail', query: { indicatorId: indicatorId } })
		},
		handleSearch() {
			this.modifierQuery.page = 1;
			this.getmodifiers();
		},
		handleBatchUpload() {
			this.$router.push({ path: '/words/batchupload', query: { type: "modifier" } })
		},
		handleBack() {
			this.dialogAddFromVisible = false;
			this.dialogEditFromVisible = false;
			this.resetModifier();
		},
		handleResetSearchQuery() {
			this.modifierQuery = {
				page: 1,
				pageSize: 10,
				needPage: true,
				sort: undefined,
				keyword: undefined,
			}
			this.getmodifiers();
		},
		handleEdit(row) {
			console.log(row)
			this.existModifier.modifierId = row.modifierId
			this.existModifier.modifierName = row.modifierName
			this.modifierValueNames = row.modifierValueName.split(",")
			this.existModifier.description = row.description
			this.dialogEditFromVisible = true
		},
		/**
		 * @description: 添加修饰词
		 * @return {*}
		 * @author: wch
		 */
		addModifier() {
			this.$refs['addForm'].validate((valid) => {
				if (valid) {
					this.newModifier.modifierId = undefined;
					for (let i = 0; i < this.modifierValueNames.length; i++) {
						this.newModifier.modifierValues.push({ modifierName: this.modifierValueNames[i] })
					}
					addModifier(this.newModifier).then(response => {
						if (response.success) {
							this.$notify({
								title: '操作成功',
								message: response.message,
								type: 'success',
								duration: 2000
							})
							this.dialogAddFromVisible = false
							this.resetModifier();
							this.getmodifiers();
						}
						else {
							this.$notify({
								title: '操作失败',
								message: response.message,
								type: 'error',
								duration: 2000
							})
							this.resetModifier()
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
		 * @description: 更新修饰词信息
		 * @return {*}
		 * @author: wch
		 */
		editModifier() {
			this.$refs['editForm'].validate((valid) => {
				if (valid) {
					for (let i = 0; i < this.modifierValueNames.length; i++) {
						this.existModifier.modifierValues.push({ modifierName: this.modifierValueNames[i] })
					}
					updateModifier(this.existModifier).then(response => {
						if (response.success) {
							this.$notify({
								title: '操作成功',
								message: response.message,
								type: 'success',
								duration: 2000
							})
							this.dialogEditFromVisible = false
							this.resetModifier();
							this.getmodifiers();
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
		 * @description: 删除修饰词
		 * @param {*} row
		 * @return {*}
		 * @author: wch
		 */
		handleDelete(row) {
			deleteModifier({ modifierId: row.modifierId }).then(response => {
				if (response.success) {
					this.$notify({
						title: '操作成功',
						message: response.message,
						type: 'success',
						duration: 2000
					})
					this.getmodifiers();
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
		 * @description: 收藏修饰词
		 * @param {*} row
		 * @param {*} index
		 * @return {*}
		 * @author: wch
		 */
		handleFavour(row, index) {
			addCollection({ modifierId: row.modifierId }).then(response => {
				if (response.success) {
					this.$set(this.modifiers[index], 'isCollect', true)
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
		 * @description: 取消收藏修饰词
		 * @param {*} row
		 * @param {*} index
		 * @return {*}
		 */
		handleCancelFavour(row, index) {
			deleteCollection({ modifierId: row.modifierId }).then(response => {
				if (response.success) {
					this.$set(this.modifiers[index], 'isCollect', false)
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
		resetModifier() {
			this.newModifier = {
				modifierId: undefined,
				modifierName: undefined,
				modifierValues: [],
				description: undefined,
			}
			this.modifierValueNames = []
		},
		/**
		 * @description: 导出表格本页的修饰词为excel文件
		 * @return {*}
		 * @author: wch
		 */
		downloadPage() {
			this.modifierQuery.needPage = true;
			this.downloadModifiers = this.modifiers
			this.download();
		},
		/**
		 * @description: 导出表格所有的修饰词为excel文件
		 * @return {*}
		 */
		downloadAll() {
			this.modifierQuery.needPage = false;
			findModifier(this.modifierQuery).then(response => {
				this.downloadModifiers = response.data.modifiers
				for (let i = 0; i < this.downloadModifiers.length; i++) {
					this.downloadModifiers[i].createTime = parseTime(new Date(this.downloadModifiers[i].createTime), '{y}-{m}-{d} {h}:{i}')
					this.downloadModifiers[i].modifierValueName = []
					for (let j = 0; j < this.downloadModifiers[i].modifierValues.length; j++) {
						this.downloadModifiers[i].modifierValueName.push(this.downloadModifiers[i].modifierValues[j].modifierName)
					}
					this.downloadModifiers[i].modifierValueName = this.downloadModifiers[i].modifierValueName.join(", ")
				}
				this.download();
			})
		},
		download() {
			this.dialogVisible = false
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then(excel => {
				const tHeader = ['修饰词名称', '创建者', '字段枚举', '创建时间']
				const filterVal = ['modifierName', 'creatorName', 'modifierValueName', 'createTime']
				const data = this.formatJson(filterVal)
				excel.export_json_to_excel({
					header: tHeader,
					data,
					filename: 'modifiers-list'
				})
				this.downloadLoading = false
			})
		},
		formatJson(filterVal) {
			return this.downloadModifiers.map(v => filterVal.map(j => {
				if (j === 'timestamp') {
					return parseTime(v[j])
				} else {
					return v[j]
				}
			}))
		},
		tableCellStyle() {
			return "border-color: #ddd;"
		},
		tableHeaderCellStyle() {
			return "border-color: #ddd; text-align: center;"
		},
	},
}
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
</style>
