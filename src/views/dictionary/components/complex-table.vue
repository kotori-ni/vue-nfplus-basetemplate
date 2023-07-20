<template>
	<div class="app-container" style="padding: 0px; margin-top: -13px;">
		<div class="filter-container">
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="">
				新增指标
			</el-button>
			<el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="">
				批量导入
			</el-button>
			<el-button v-waves :loading="downloadLoading" class="filter-item" size="mini" type="primary"
				icon="el-icon-download" @click="handleDownload">
				导出
			</el-button>
		</div>
		<hr style="height: 1px; background-color: #ddd; margin-top: 10px; margin-bottom: 5px; border: none;" />
		<div class="search-container" style="margin-top: 5px;">
			<el-select v-model="childRequestQuery.indicator_type" placeholder="指标类型" clearable style="width: 150px;"
				class="search_item">
				<el-option v-for="item in types" :key="item.key" :label="item.value" :value="item.key" />
			</el-select>
			<el-select v-model="childRequestQuery.indicator_state" placeholder="指标状态" clearable class="search_item"
				style="width: 110px; margin-left: 10px;">
				<el-option v-for="item in states" :key="item.key" :label="item.value" :value="item.key" />
			</el-select>
			<el-select v-model="childRequestQuery.creator_id" placeholder="创建人" clearable class="search_item"
				style="width: 110px; margin-left: 10px;">
				<el-option v-for="item in creators" :key="item.key" :label="item.value" :value="item.key" />
			</el-select>
			<el-link :underline="false" style="margin-left: 10px;" @click="resetRequestQuery">重置<i
					class="el-icon-setting el-icon--right"></i></el-link>
			<el-button v-waves class="search-item" type="primary" icon="el-icon-search" @click="handleSearch"
				style="width: 80px; margin-left: 10px; padding: 7px 12px; border-radius: 3px;">
				搜索
			</el-button>
		</div>

		<el-table :key="tableKey" v-loading="false" :data="indicators" border fit highlight-current-row
			style="width: 100%; margin-top: 10px; border: 1px solid #ddd;" :cell-style="tableCellStyle"
			:header-cell-style="tableHeaderCellStyle">
			<el-table-column label="ID" prop="index" align="center" width="60">
				<template slot-scope="{row}">
					<span>{{ row.index }}</span>
				</template>
			</el-table-column>
			<el-table-column label="指标名称" min-width="150" align="center">
				<template slot-scope="{row}">
					<span>{{ row.indicator_name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="指标标识" min-width="200" align="center">
				<template slot-scope="{row}">
					<span>{{ row.indicator_id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="指标类型" prop="indicator_type_name" width="110" align="center">
				<template slot-scope="{row}">
					<span>{{ row.indicator_type_name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="指标状态" prop="indicator_state_name" width="80" align="center">
				<template slot-scope="{row}">
					<el-tag :type="row.indicator_state_name | statusFilter" size="small">
						{{ row.indicator_state_name }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="指标域" prop="domain_name" min-width="110" align="center">
				<template slot-scope="{row}">
					<span>{{ row.domain_name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建人" prop="creator_name" width="100" align="center">
				<template slot-scope="{row}">
					<span>{{ row.creator_name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="指标版本" prop="version" width="90" align="center">
				<template slot-scope="{row}">
					<span>{{ row.version }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" min-width="150" class-name="small-padding fixed-width">
				<template slot-scope="{row,$index}">
					<el-button size="mini" @click="">
						编辑
					</el-button>
					<el-button v-if="row.indicator_state == 3" size="mini" type="danger"
						@click="handleOffline(row, $index)">
						下线
					</el-button>
					<el-button v-if="row.indicator_state == 4" size="mini" type="primary"
						@click="handleOnline(row, $index)">
						发布
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total >= 0" :total="total" :page.sync="childRequestQuery.page" :limit.sync="pagesize"
			@pagination="getIndicators" style="height: 65px;" />
	</div>
</template>
  
<script>
import { getIndicatorList, getCreatorList, offlineIndicator, onlineIndicator } from '@/api/dictionary'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
	name: 'ComplexTable',
	components: { Pagination },
	directives: { waves },
	filters: {
		statusFilter(status) {
			const statusMap = {
				新建: 'info',
				草稿: '',
				已发布: 'success',
				已下线: 'warning'
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
				pagesize: 10,
				needpage: true,
				creator_id: undefined,
				domain_id: undefined,
				indicator_state: undefined,
				indicator_type: undefined,
				allmessage: false,
				sort: '+id'
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
			indicators: null,
			total: 0,
			childRequestQuery: {},
			types: [{ key: 0, value: "全部" }, { key: 1, value: "主原子指标" }, { key: 2, value: "衍生原子指标" }, { key: 3, value: "派生指标" }, { key: 4, value: "复合指标" }],
			states: [{ key: 0, value: "全部" }, { key: 1, value: "新建" }, { key: 2, value: "草稿" }, { key: 3, value: "已发布" }, { key: 4, value: "已下线" }],
			creators: [],
			sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
			downloadLoading: false
		}
	},
	watch: {
		query(newQuery) {
			this.childRequestQuery = newQuery
		},
		'query.domain_id'(newDomainId) {
			this.childRequestQuery.domain_id = newDomainId
			this.getIndicators()
		},
		childRequestQuery(newQuery) {
			this.$emit('update', newQuery)
		}
	},
	mounted() {
		this.childRequestQuery = this.query
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
			getIndicatorList(this.childRequestQuery).then(response => {
				this.indicators = response.data.indicators
				this.total = response.data.total
			})
		},
		handleSearch() {
			this.childRequestQuery.page = 1
			this.getIndicators()
		},
		resetRequestQuery() {
			this.childRequestQuery.page = 1
			this.childRequestQuery.pagesize = this.pagesize
			this.childRequestQuery.needpage = true
			this.childRequestQuery.creator_id = undefined
			this.childRequestQuery.domain_id = undefined
			this.childRequestQuery.indicator_state = undefined
			this.childRequestQuery.indicator_type = undefined
			this.childRequestQuery.allmessage = false
			this.childRequestQuery.sort = '+id'
		},
		handleOnline(row, index) {
			var data = {
				indicator_type: row.indicator_type,
				indicator_state: 3
			}
			var params = { sourceId: row.indicator_id }
			onlineIndicator(data, params).then(response => {
				this.indicators[index].indicator_state = 3
				if (response.success) {
					this.$notify({
						title: 'Success',
						message: '指标已发布',
						type: 'success',
						duration: 2000
					})
				}
				else {
					this.$notify({
						title: 'Error',
						message: '发布指标失败',
						type: 'error',
						duration: 2000
					})
				}
			})
		},
		handleOffline(row, index) {
			var data = {
				indicator_type: row.indicator_type,
				indicator_state: 4
			}
			var params = { sourceId: row.indicator_id }
			offlineIndicator(data, params).then(response => {
				this.indicators[index].indicator_state = 4
				if (response.success) {
					this.$notify({
						title: 'Success',
						message: '指标已下线',
						type: 'success',
						duration: 2000
					})
				}
				else {
					this.$notify({
						title: 'Error',
						message: '下线指标失败',
						type: 'error',
						duration: 2000
					})
				}
			})
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then(excel => {
				const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
				const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
				const data = this.formatJson(filterVal)
				excel.export_json_to_excel({
					header: tHeader,
					data,
					filename: 'table-list'
				})
				this.downloadLoading = false
			})
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

<style>
.el-select .el-input__inner {
	height: 30px;
	color: #000;

	&::placeholder {
		color: black;
		font-size: 14px;
	}
}

.el-select .el-input .el-select__caret {
	height: 115%;
}

.el-select .el-input .el-select__caret.is-reverse {
	line-height: 5px;
}

.el-table td {
	padding-top: 6px;
	padding-bottom: 6px;
}
</style>