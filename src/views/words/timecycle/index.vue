<template>
	<div class="app-container">
		<div class="filter-container" style="display: inline-block; width: 100%;">
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="dialogAddFromVisible = true">
				新增时间周期
			</el-button>
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="handleBatchUpload">
				批量导入
			</el-button>
			<el-button v-waves :loading="downloadLoading" class="filter-item" size="mini" type="primary"
				icon="el-icon-download" @click="dialogVisible = true">
				导出
			</el-button>
			<div style="float: right;" class="search_item">
				<el-select v-model="timeCycleQuery.sort" placeholder="请选择" clearable style="width: 120px; margin-right: 10px;">
					<el-option v-for="item in types" :key="item.key" :label="item.label" :value="item.key" />
				</el-select>
				<el-input v-model="timeCycleQuery.keyword" placeholder="请输入关键词" clearable style="width: 150px;" class="input"/>
				<el-link :underline="false" style="margin-left: 10px; margin-right: 10px;" @click="handleResetSearchQuery">重置<i
						class="el-icon-setting el-icon--right" style="float: right;"></i></el-link>
				<el-button v-waves class="search-item" type="primary" icon="el-icon-search" @click="handleSearch"
					size="mini">
					搜索
				</el-button>
			</div>
		</div>

		<hr style="height: 1px; background-color: #ddd; margin-top: 10px; margin-bottom: 5px; border: none;" />

		<el-table :key="tableKey" :data="timeCycles" border fit highlight-current-row
			style="width: 100%; margin-top: 10px; border: 1px solid #ddd;" :cell-style="tableCellStyle"
			:header-cell-style="tableHeaderCellStyle">
			<el-table-column label="ID" prop="index" align="center" width="60">
				<template slot-scope="{row}">
					<span>{{ row.index }}</span>
				</template>
			</el-table-column>
			<el-table-column label="时间周期名称" prop="timeCycleName" width="200" align="center">
				<template slot-scope="{row}">
					<span>{{ row.timeCycleName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建者" width="150" prop="creatorName" align="center">
				<template slot-scope="{row}">
					<span>{{ row.creatorName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建时间" prop="createTime" width="200" align="center">
				<template slot-scope="{row}">
					<span>{{ row.createTime }}</span>
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

		<pagination v-show="total >= 0" :total="total" :page.sync="timeCycleQuery.page" :limit.sync="timeCycleQuery.pageSize"
			@pagination="getTimeCycles" style="height: 65px;" />

		<el-dialog title="新增时间周期" :visible.sync="dialogAddFromVisible">
			<el-form ref="addForm" :rules="rules" :model="newTimeCycle" label-position="left" label-width="auto">
				<el-form-item label="时间周期名称" prop="timeCycleName">
					<el-input v-model="newTimeCycle.timeCycleName" placeholder="1-64个字符" maxlength="128"
							show-word-limit autosize type="textarea"/>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="newTimeCycle.description" placeholder="1-255个字符" maxlength="255"
							show-word-limit autosize type="textarea"/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleBack">返回</el-button>
				<el-button type="primary" @click="addTimeCycle">确认添加</el-button>
			</div>
		</el-dialog>

		<el-dialog title="编辑时间周期" :visible.sync="dialogEditFromVisible">
			<el-form ref="editForm" :rules="rules" :model="existTimeCycle" label-position="left" label-width="auto">
				<el-form-item label="时间周期名称" prop="timeCycleName">
					<el-input v-model="existTimeCycle.timeCycleName" placeholder="1-64个字符" maxlength="128"
							show-word-limit autosize type="textarea"/>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="existTimeCycle.description" placeholder="1-255个字符" maxlength="255"
							show-word-limit autosize type="textarea"/>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleBack">返回</el-button>
				<el-button type="primary" @click="editTimeCycle">确认修改</el-button>
			</div>
		</el-dialog>

		<el-dialog title="导出设定" :visible.sync="dialogVisible" width="30%">
			<span>导出本页的时间周期还是全部时间周期?</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="downloadPage">仅本页</el-button>
				<el-button type="primary" @click="downloadAll">全部</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { findTimeCycle, addTimeCycle, updateTimeCycle } from '@/api/timecycle.js';
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
			timeCycles: undefined,
			downloadTimeCycles: undefined,
			downloadLoading: false,
			dialogVisible: false,
			dialogAddFromVisible: false,
			dialogEditFromVisible: false,
			types: [{key: "all", label: "全部"}, { key: "timeCycleName", label: "时间周期名称" }, { key: "creatorName", label: "创建者" } ],
			timeCycleQuery: {
				page: 1,
				pageSize: 10,
				needPage: true,
				sort: undefined,
				keyword: undefined,
			},
			newTimeCycle: {
				timeCycleId: undefined,
				timeCycleName: undefined,
				description: undefined,
			},
			existTimeCycle: {
				timeCycleId: undefined,
				timeCycleName: undefined,
				description: undefined,
			},
			rules: {
				timeCycleName: [
					{ required: true, message: '请输入时间周期名称', trigger: 'blur' },
					{ min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
				],
				description: [
					{ min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
				],
			}
		}
	},
	mounted() {
		this.getTimeCycles()
	},
	methods: {
		getTimeCycles() {
			this.timeCycleQuery.needPage = true;
			if (this.timeCycleQuery.sort == null)
				this.timeCycleQuery.sort = "all"
			findTimeCycle(this.timeCycleQuery).then(res => {
				this.total = res.data.timeCycles.total
				this.timeCycles = res.data.timeCycles.records
				this.tableKey += 1

				for (let i = 0; i < this.timeCycles.length; i++) 
					this.timeCycles[i].createTime = parseTime(new Date(this.timeCycles[i].createTime), '{y}-{m}-{d} {h}:{i}')
				this.timeCycleQuery.sort = null;
			})
		},
		handleSearch() {
			this.timeCycleQuery.page = 1;
			this.getTimeCycles();
		},
		handleBatchUpload() {
			this.$router.push({ path: '/words/batchupload', query: { type: "timeCycle" } })
		},
		handleBack() {
			this.dialogAddFromVisible = false;
			this.dialogEditFromVisible = false;
			this.resetTimeCycle;
		},
		handleResetSearchQuery() {
			this.timeCycleQuery = {
				page: 1,
				pageSize: 10,
				needPage: true,
				sort: undefined,
				keyword: undefined,
			}
			this.getTimeCycles();
		},
		handleEdit(row) {
			this.existTimeCycle.timeCycleId = row.timeCycleId
			this.existTimeCycle.timeCycleName = row.timeCycleName
			this.existTimeCycle.description = row.description
			this.dialogEditFromVisible = true
		},
		addTimeCycle() {
			this.$refs['addForm'].validate((valid) => {
				if (valid) {
					this.newTimeCycle.timeCycleId = undefined;
					addTimeCycle(this.newTimeCycle).then(response => {
						if (response.success) {
							this.$notify({
								title: '操作成功',
								message: response.message,
								type: 'success',
								duration: 2000
							})
							this.dialogAddFromVisible = false
							this.resetTimeCycle();
							this.getTimeCycles();
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
		editTimeCycle(){
			this.$refs['editForm'].validate((valid) => {
				if (valid) {
					updateTimeCycle(this.existTimeCycle).then(response => {
						if (response.success) {
							this.$notify({
								title: '操作成功',
								message: response.message,
								type: 'success',
								duration: 2000
							})
							this.dialogEditFromVisible = false
							this.resetTimeCycle;
							this.getTimeCycles();
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
			addCollection({ timeCycleId: row.timeCycleId }).then(response => {
				if (response.success) {
					this.$set(this.timeCycles[index], 'isCollect', true)
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
			deleteCollection({ timeCycleId: row.timeCycleId }).then(response => {
				if (response.success) {
					this.$set(this.timeCycles[index], 'isCollect', false)
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
		resetTimeCycle() {
			this.newTimeCycle = {
				timeCycleId: undefined,
				timeCycleName: undefined,
				description: undefined,
			}
			this.editTimeCycle = {
				timeCycleId: undefined,
				timeCycleName: undefined,
				description: undefined,
			}
		},
		downloadPage() {
			this.timeCycleQuery.needPage = true;
			this.downloadTimeCycles = this.timeCycles
			this.download();
		},
		downloadAll() {
			this.timeCycleQuery.needPage = false;
			findTimeCycle(this.timeCycleQuery).then(response => {
				this.downloadTimeCycles = response.data.timeCycles
				this.download();
			})
		},
		download() {
			this.dialogVisible = false
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then(excel => {
				const tHeader = ['时间周期名称', '创建者', '描述', '创建时间']
				const filterVal = ['timeCycleName', 'creatorName', 'description', 'createTime']
				const data = this.formatJson(filterVal)
				excel.export_json_to_excel({
					header: tHeader,
					data,
					filename: 'timeCycles-list'
				})
				this.downloadLoading = false
			})
		},
		formatJson(filterVal) {
			return this.downloadTimeCycles.map(v => filterVal.map(j => {
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
