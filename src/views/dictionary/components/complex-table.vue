<template>
	<div class="app-container" style="padding: 0px; margin-top: -13px;">
		<div class="filter-container">
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="handleAddIndicator">
				新增指标
			</el-button>
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="">
				批量导入
			</el-button>
			<el-button v-waves :loading="downloadLoading" class="filter-item" size="mini" type="primary"
				icon="el-icon-download" @click="dialogVisible = true">
				导出
			</el-button>
		</div>
		<hr style="height: 1px; background-color: #ddd; margin-top: 10px; margin-bottom: 5px; border: none;" />
		<div class="search-container" style="margin-top: 5px;">
			<el-select v-model="childRequestQuery.indicatorType" placeholder="指标类型" clearable style="width: 150px;"
				class="search_item">
				<el-option v-for="item in types" :key="item.key" :label="item.value" :value="item.key" />
			</el-select>
			<el-select v-model="childRequestQuery.indicatorState" placeholder="指标状态" clearable class="search_item"
				style="width: 110px; margin-left: 10px;">
				<el-option v-for="item in states" :key="item.key" :label="item.value" :value="item.key" />
			</el-select>
			<el-select v-model="childRequestQuery.creatorId" placeholder="创建人" clearable class="search_item"
				style="width: 110px; margin-left: 10px;">
				<el-option v-for="item in creators" :key="item.userId" :label="item.username" :value="item.userId" />
			</el-select>
			<el-link :underline="false" style="margin-left: 10px;" @click="resetRequestQuery()">重置<i
					class="el-icon-setting el-icon--right"></i></el-link>
			<el-button v-waves class="search-item" type="primary" icon="el-icon-search" @click="handleSearch"
				style="width: 80px; margin-left: 10px; padding: 7px 12px; border-radius: 3px;">
				搜索
			</el-button>
		</div>

		<el-table :key="tableKey" :data="indicators" border fit highlight-current-row
			style="width: 100%; margin-top: 10px; border: 1px solid #ddd;" :cell-style="tableCellStyle"
			:header-cell-style="tableHeaderCellStyle" @row-click="showDetails">
			<el-table-column label="ID" prop="index" align="center" width="60">
				<template slot-scope="{row}">
					<span>{{ row.index }}</span>
				</template>
			</el-table-column>
			<el-table-column label="指标名称" min-width="150" align="center">
				<template slot-scope="{row}">
					<span>{{ row.indicatorName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="指标标识" min-width="200" align="center">
				<template slot-scope="{row}">
					<span>{{ row.indicatorId }}</span>
				</template>
			</el-table-column>
			<el-table-column label="指标类型" prop="indicatorTypeName" width="110" align="center">
				<template slot-scope="{row}">
					<span>{{ row.indicatorTypeName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="指标状态" prop="indicatorStateName" width="80" align="center">
				<template slot-scope="{row}">
					<el-tag :type="row.indicatorStateName | statusFilter" size="small">
						{{ row.indicatorStateName }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="指标域" prop="domainName" min-width="110" align="center">
				<template slot-scope="{row}">
					<span>{{ row.domainName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建人" prop="creatorName" width="100" align="center">
				<template slot-scope="{row}">
					<span>{{ row.creatorName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="225" class-name="small-padding fixed-width">
				<template slot-scope="{row,$index}">
					<el-button size="mini" @click.native.stop="handleEdit(row)">
						编辑
					</el-button>
					<el-button v-if="row.isCollect == false" size="mini" @click.native.stop="handleFavour(row, $index)" type="success">
						收藏
					</el-button>
					<el-button v-if="row.isCollect == true" size="mini" @click.native.stop="handleCancelFavour(row, $index)"
						type="warning">
						已收藏
					</el-button>
					<el-button v-if="row.indicatorState == 3" size="mini" type="danger"
						@click.native.stop="handleOffline(row, $index)">
						下线
					</el-button>
					<el-button v-if="row.indicatorState != 3" size="mini" type="primary"
						@click.native.stop="handleOnline(row, $index)">
						发布
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total >= 0" :total="total" :page.sync="childRequestQuery.page" :limit.sync="pagesize"
			@pagination="getIndicators" style="height: 65px;" />

		<el-dialog title="导出设定" :visible.sync="dialogVisible" width="30%">
			<span>导出本页的数据指标还是全部数据指标?</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="downloadPage">仅本页</el-button>
				<el-button type="primary" @click="downloadAll">全部</el-button>
			</span>
		</el-dialog>
	</div>
</template>
  
<script>
import { getIndicatorList, getCreatorList, changeState } from '@/api/dictionary'
import { addCollection, deleteCollection } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
	name: 'ComplexTable',
	components: { Pagination },
	directives: { waves },
	filters: {
		statusFilter(status) {
			const statusMap = {
				新建: '',
				草稿: 'info',
				已发布: 'success',
				已下线: 'warning',
			}
			return statusMap[status]
		},
		typeFilter(type) {
			return calendarTypeKeyValue[type]
		}
	},
	props: {
		query: {
			type: Object,
			required: true,
			default: {
				page: 1,
				pageSize: 10,
				needPage: true,
				creatorId: undefined,
				domainId: undefined,
				indicatorState: undefined,
				indicatorType: undefined,
				keyword: undefined,
				sortMethod: undefined
			},
		},
		pagesize: {
			type: Number,
			default: 10
		}
	},
	data() {
		return {
			tableKey: 0,
			dialogVisible: false,
			indicators: [],
			downloadIndicators: null,
			total: 0,
			childRequestQuery: {},
			types: [{ key: 0, value: "全部" }, { key: 1, value: "主原子指标" }, { key: 2, value: "衍生原子指标" }, { key: 3, value: "派生指标" }, { key: 4, value: "复合指标" }],
			states: [{ key: 0, value: "全部" }, { key: 1, value: "新建" }, { key: 2, value: "草稿" }, { key: 3, value: "已发布" }, { key: 4, value: "已下线" }],
			creators: [],
			downloadLoading: false
		}
	},
	watch: {
		query(newQuery) {
			this.childRequestQuery = newQuery
		},
		'query.domainId'(newDomainId) {
			this.childRequestQuery.domainId = newDomainId
			this.getIndicators()
		},
		childRequestQuery(newQuery) {
			this.$emit('update', newQuery)
		}
	},
	mounted() {
		this.childRequestQuery = this.query
		if (this.$route.params != null){
			this.childRequestQuery.sortMethod = "all"
			this.childRequestQuery.keyword = this.$route.params.searchKeyword
		}
		this.getIndicators();
		this.getCreators();
	},
	methods: {
		getCreators() {
			getCreatorList().then(response => {
				this.creators = response.data.creators
			})
		},
		getIndicators() {
			this.childRequestQuery.needPage = true;
			getIndicatorList(this.childRequestQuery).then(response => {
				this.indicators = response.data.indicators.records
				this.total = response.data.indicators.total
			})
		},
		showDetails(row) {
			this.$router.push({ path: '/indicator/dictionary/detail', query: { indicatorId: row.indicatorId } })
		},
		handleSearch() {
			this.childRequestQuery.page = 1
			this.getIndicators()
		},
		resetRequestQuery() {
			this.childRequestQuery.page = 1
			this.childRequestQuery.pageSize = 10
			this.childRequestQuery.needPage = true
			this.childRequestQuery.creatorId = undefined
			this.childRequestQuery.domainId = undefined
			this.childRequestQuery.indicatorState = undefined
			this.childRequestQuery.indicatorType = undefined
			this.childRequestQuery.keyword = undefined
			this.childRequestQuery.sortMethod = undefined
			this.getIndicators()
		},
		handleAddIndicator() {
			this.$router.push({ path: '/indicator/dictionary/add' })
		},
		handleEdit(indicator) {
			this.$router.push({ path: '/indicator/dictionary/edit', query: { indicatorId: indicator.indicatorId } })
		},
		handleOnline(row, index) {
			var params = { newState: 3, indicatorId: row.indicatorId }
			changeState(params).then(response => {
				if (response.success) {
					this.$set(this.indicators[index], 'indicatorState', 3)
					this.$set(this.indicators[index], 'indicatorStateName', '已发布')
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
		handleOffline(row, index) {
			var params = { newState: 4, indicatorId: row.indicatorId,  }
			changeState(params).then(response => {
				if (response.success) {
					this.$set(this.indicators[index], 'indicatorState', 4)
					this.$set(this.indicators[index], 'indicatorStateName', '已下线')
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
		handleFavour(row, index) {
			addCollection({ indicatorId: row.indicatorId }).then(response => {
				if (response.success) {
					this.$set(this.indicators[index], 'isCollect', true)
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
			deleteCollection({ indicatorId: row.indicatorId }).then(response => {
				if (response.success) {
					this.$set(this.indicators[index], 'isCollect', false)
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
		downloadPage() {
			this.childRequestQuery.needPage = true;
			getIndicatorList(this.childRequestQuery).then(response => {
				this.downloadIndicators = response.data.indicators.records.map((indicator) => {
					if (indicator.compositedNames != null)
						indicator.compositedNames = indicator.compositedNames.join(',');
					if (indicator.derivationNames != null)
						indicator.derivationnames = indicator.derivationNames.join(',');
					if (indicator.modifierNames != null)
						indicator.modifierNames = indicator.modifierNames.join(',');
					return indicator;
				})
				this.download();
			})
		},
		downloadAll() {
			this.childRequestQuery.needPage = false;
			getIndicatorList(this.childRequestQuery).then(response => {
				this.downloadIndicators = response.data.indicators.map((indicator) => {
					if (indicator.compositedNames != null)
						indicator.compositedNames = indicator.compositedNames.join(',');
					if (indicator.derivationNames != null)
						indicator.derivationnames = indicator.derivationNames.join(',');
					if (indicator.modifierNames != null)
						indicator.modifierNames = indicator.modifierNames.join(',');
					return indicator;
				})
				this.download();
			})
		},
		download() {
			this.dialogVisible = false
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then(excel => {
				const tHeader = ['指标名称', '指标标识', '指标类型', '指标状态', '依赖的主原子指标', '指标域', '创建者', '创建时间', '最后修改者', '可分析维度', '安全级别', '关联报表链接', '业务口径', '业务口径负责人', '技术口径', '实时技术口径', '技术口径负责人', '主管部门', '衍生词列表', '修饰词列表', '其他指标列表', '时间周期', '运算规则']
				const filterVal = ['indicatorName', 'indicatorId', 'indicatorType', 'indicatorState', 'dependentIndicatorName', 'domainName', 'creatorName', 'createTime', 'lastOperatorName', 'analyzableDimensions', 'securityLevel', 'affiliatedReportLinks', 'businessCaliber', 'businessCaliberLeader', 'technicalCaliber', 'realtimeTechnicalCaliber', 'technicalCaliberLeader', 'competentAuthoritie', 'derivationNames', 'modifierNames', 'compositedNames', 'timeCycleName', 'calculateRule']
				const data = this.formatJson(filterVal)
				excel.export_json_to_excel({
					header: tHeader,
					data,
					filename: 'indicators-list'
				})
				this.downloadLoading = false
			})
		},
		formatJson(filterVal) {
			return this.downloadIndicators.map(v => filterVal.map(j => {
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
		}
	},
}
</script>

<style scoped>

::v-deep .search_item .el-input__inner {
	height: 32px;
	color: #000;

	&::placeholder {
		color: black;
		font-size: 14px;
	}
}


::v-deep .search_item .el-input__icon {
	height: 115%;
}


::v-deep .search_item .el-input .el-select_Caret.is-reverse {
	line-height: 5px;
}


::v-deep .el-table td {
	padding-top: 8px;
	padding-bottom: 8px;
}
</style>