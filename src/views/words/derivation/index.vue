<template>
	<div class="app-container">
		<div class="filter-container" style="display: inline-block; width: 100%;">
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="dialogAddFromVisible = true">
				新增衍生词
			</el-button>
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="handleBatchUpload">
				批量导入
			</el-button>
			<el-button v-waves :loading="downloadLoading" class="filter-item" size="mini" type="primary"
				icon="el-icon-download" @click="dialogVisible = true">
				导出
			</el-button>
			<div style="float: right;" class="search_item">
				<el-select v-model="derivationQuery.sort" placeholder="请选择" clearable style="width: 120px; margin-right: 10px;">
					<el-option v-for="item in types" :key="item.key" :label="item.label" :value="item.key" />
				</el-select>
				<el-input v-model="derivationQuery.keyword" placeholder="请输入关键词" clearable style="width: 150px;" class="input"/>
				<el-link :underline="false" style="margin-left: 10px; margin-right: 10px;" @click="handleResetSearchQuery">重置<i
						class="el-icon-setting el-icon--right" style="float: right;"></i></el-link>
				<el-button v-waves class="search-item" type="primary" icon="el-icon-search" @click="handleSearch"
					size="mini">
					搜索
				</el-button>
			</div>
		</div>

		<hr style="height: 1px; background-color: #ddd; margin-top: 10px; margin-bottom: 5px; border: none;" />

		<el-table :key="tableKey" :data="derivations" border fit highlight-current-row
			style="width: 100%; margin-top: 10px; border: 1px solid #ddd;" :cell-style="tableCellStyle"
			:header-cell-style="tableHeaderCellStyle">
			<el-table-column label="ID" prop="index" align="center" width="60">
				<template slot-scope="{row}">
					<span>{{ row.index }}</span>
				</template>
			</el-table-column>
			<el-table-column label="衍生词名称" prop="derivationName" width="150" align="center">
				<template slot-scope="{row}">
					<span>{{ row.derivationName }}</span>
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
			<el-table-column label="计算口径" prop="calculationCaliber" min-width="200" align="center">
				<template slot-scope="{row}">
					<span>{{ row.calculationCaliber }}</span>
				</template>
			</el-table-column>
			<el-table-column label="描述" prop="description" min-width="200" align="center">
				<template slot-scope="{row}">
					<span>{{ row.description }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
				<template slot-scope="{row,$index}">
					<el-button size="mini" @click="handleEdit(row)">
						编辑
					</el-button>
					<el-button v-if="row.isCollect == false" size="mini" @click="handleFavour(row, $index)" type="success">
						收藏
					</el-button>
					<el-button v-if="row.isCollect == true" size="mini" @click="handleCancelFavour(row, $index)" type="warning">
						已收藏
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total >= 0" :total="total" :page.sync="derivationQuery.page" :limit.sync="derivationQuery.pageSize"
			@pagination="getderivations" style="height: 65px;" />

		<el-dialog title="新增衍生词" :visible.sync="dialogAddFromVisible">
			<el-form ref="addForm" :rules="rules" :model="newDerivation" label-position="left" label-width="auto">
				<el-form-item label="衍生词名称" prop="derivationName">
					<el-input v-model="newDerivation.derivationName" placeholder="1-64个字符" maxlength="128"
							show-word-limit autosize type="textarea"/>
				</el-form-item>
				<el-form-item label="计算口径" prop="calculationCaliber">
					<el-input v-model="newDerivation.calculationCaliber" placeholder="1-255个字符" maxlength="255"
							show-word-limit autosize type="textarea"/>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="newDerivation.description" placeholder="1-255个字符" maxlength="255"
							show-word-limit autosize type="textarea"/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleBack">返回</el-button>
				<el-button type="primary" @click="addDerivation">确认添加</el-button>
			</div>
		</el-dialog>

		<el-dialog title="编辑衍生词" :visible.sync="dialogEditFromVisible">
			<el-form ref="editForm" :rules="rules" :model="existDerivation" label-position="left" label-width="auto">
				<el-form-item label="衍生词名称" prop="derivationName">
					<el-input v-model="existDerivation.derivationName" placeholder="1-64个字符" maxlength="128"
							show-word-limit autosize type="textarea"/>
				</el-form-item>
				<el-form-item label="计算口径" prop="calculationCaliber">
					<el-input v-model="existDerivation.calculationCaliber" placeholder="1-255个字符" maxlength="255"
							show-word-limit autosize type="textarea"/>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="existDerivation.description" placeholder="1-255个字符" maxlength="255"
							show-word-limit autosize type="textarea"/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleBack">返回</el-button>
				<el-button type="primary" @click="editDerivation">确认修改</el-button>
			</div>
		</el-dialog>

		<el-dialog title="导出设定" :visible.sync="dialogVisible" width="30%">
			<span>导出本页的衍生词还是全部衍生词?</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="downloadPage">仅本页</el-button>
				<el-button type="primary" @click="downloadAll">全部</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { findDerivation, addDerivation, updateDerivation } from '@/api/derivation.js';
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
			derivations: undefined,
			downloadDerivations: undefined,
			downloadLoading: false,
			dialogVisible: false,
			dialogAddFromVisible: false,
			dialogEditFromVisible: false,
			types: [{key: "all", label: "全部"}, { key: "derivationName", label: "衍生词名称" }, { key: "creatorName", label: "创建者" }, { key: "calculationCaliber", label: "计算口径" }],
			derivationQuery: {
				page: 1,
				pageSize: 10,
				needPage: true,
				sort: undefined,
				keyword: undefined,
			},
			newDerivation: {
				derivationId: undefined,
				derivationName: undefined,
				calculationCaliber: undefined,
				description: undefined,
			},
			existDerivation: {
				derivationId: undefined,
				derivationName: undefined,
				calculationCaliber: undefined,
				description: undefined,
			},
			rules: {
				derivationName: [
					{ required: true, message: '请输入衍生词名称', trigger: 'blur' },
					{ min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
				],
				calculationCaliber: [
					{ required: true, message: '请输入计算口径', trigger: 'blur' },
					{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
				],
				description: [
					{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
				],
			}
		}
	},
	mounted() {
		this.getderivations()
	},
	methods: {
		getderivations() {
			this.derivationQuery.needPage = true;
			if (this.derivationQuery.sort == null)
				this.derivationQuery.sort = "all"
			findDerivation(this.derivationQuery).then(res => {
				this.total = res.data.derivations.total
				this.derivations = res.data.derivations.records
				this.tableKey += 1

				for (let i = 0; i < this.derivations.length; i++) 
					this.derivations[i].createTime = parseTime(new Date(this.derivations[i].createTime), '{y}-{m}-{d} {h}:{i}')
				this.derivationQuery.sort = null;
			})
		},
		handleSearch() {
			this.derivationQuery.page = 1;
			this.getderivations();
		},
		handleBatchUpload(){
			this.$router.push({ path: '/words/batchupload', query: { type: "derivation" } })
		},
		handleBack() {
			this.dialogAddFromVisible = false;
			this.dialogEditFromVisible = false;
			this.resetDerivation;
		},
		handleResetSearchQuery() {
			this.derivationQuery = {
				page: 1,
				pageSize: 10,
				needPage: true,
				sort: undefined,
				keyword: undefined,
			}
			this.getderivations();
		},
		handleEdit(row) {
			this.existDerivation.derivationId = row.derivationId
			this.existDerivation.derivationName = row.derivationName
			this.existDerivation.calculationCaliber = row.calculationCaliber
			this.existDerivation.description = row.description
			this.dialogEditFromVisible = true
		},
		addDerivation() {
			this.$refs['addForm'].validate((valid) => {
				if (valid) {
					this.newDerivation.derivationId = undefined;
					addDerivation(this.newDerivation).then(response => {
						if (response.success) {
							this.$notify({
								title: '操作成功',
								message: response.message,
								type: 'success',
								duration: 2000
							})
							this.dialogAddFromVisible = false
							this.resetDerivation();
							this.getderivations();
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
		editDerivation(){
			this.$refs['editForm'].validate((valid) => {
				if (valid) {
					updateDerivation(this.existDerivation).then(response => {
						if (response.success) {
							this.$notify({
								title: '操作成功',
								message: response.message,
								type: 'success',
								duration: 2000
							})
							this.dialogEditFromVisible = false
							this.resetDerivation;
							this.getderivations();
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
		handleFavour(row, index) {
			addCollection({ derivationId: row.derivationId }).then(response => {
				if (response.success) {
					this.$set(this.derivations[index], 'isCollect', true)
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
		handleCancelFavour(row, index) {
			deleteCollection({ derivationId: row.derivationId }).then(response => {
				if (response.success) {
					this.$set(this.derivations[index], 'isCollect', false)
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
		resetDerivation() {
			this.newDerivation = {
				derivationName: undefined,
				calculationCaliber: undefined,
				description: undefined,
			},
			this.existDerivation = {
				derivationId: undefined,
				derivationName: undefined,
				calculationCaliber: undefined,
				description: undefined,
			}
		},
		downloadPage() {
			this.derivationQuery.needPage = true;
			this.downloadDerivations = this.derivations
			this.download();
		},
		downloadAll() {
			this.derivationQuery.needPage = false;
			findDerivation(this.derivationQuery).then(response => {
				this.downloadDerivations = response.data.derivations
				this.download();
			})
		},
		download() {
			this.dialogVisible = false
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then(excel => {
				const tHeader = ['衍生词名称', '创建者', '计算口径', '描述', '创建时间']
				const filterVal = ['derivationName', 'creatorName', 'calculationCaliber', 'description', 'createTime']
				const data = this.formatJson(filterVal)
				excel.export_json_to_excel({
					header: tHeader,
					data,
					filename: 'derivations-list'
				})
				this.downloadLoading = false
			})
		},
		formatJson(filterVal) {
			return this.downloadDerivations.map(v => filterVal.map(j => {
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
			return "border-color: #ddd;"
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
