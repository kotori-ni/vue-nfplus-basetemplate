<template>
	<div class="main_container">
		<el-tabs v-model="activeName">
			<el-tab-pane label="我收藏的" name="myFavour">
				<div class="search-container" style="margin-top: 5px;">
					<el-select v-model="childRequestQuery.indicatorType" placeholder="指标类型" clearable style="width: 150px;"
						class="search_item">
						<el-option v-for="item in types" :key="item.key" :label="item.value" :value="item.key" />
					</el-select>
					<el-select v-model="childRequestQuery.indicatorState" placeholder="指标状态" clearable class="search_item"
						style="width: 110px; margin-left: 10px;">
						<el-option v-for="item in states" :key="item.key" :label="item.value" :value="item.key" />
					</el-select>
					<el-link :underline="false" style="margin-left: 10px;" @click="resetRequestQuery()">重置<i
							class="el-icon-setting el-icon--right"></i></el-link>
					<el-button v-waves class="search-item" type="primary" icon="el-icon-search" @click="handleSearch"
						style="width: 80px; margin-left: 10px; padding: 7px 12px; border-radius: 3px;">
						搜索
					</el-button>
				</div>

				<el-table :key="tableKey" :data="favourIndicators" border fit highlight-current-row
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
					<el-table-column label="操作" align="center" width="225" class-name="small-padding fixed-width">
						<template slot-scope="{row,$index}">
							<el-button size="mini" @click.native.stop="handleEdit(row)">
								编辑
							</el-button>
							<el-button v-if="row.isCollect == true" size="mini"
								@click.native.stop="handleCancelFavour(row, $index)" type="warning">
								已收藏
							</el-button>
						</template>
					</el-table-column>
				</el-table>

				<pagination v-show="favourTotal >= 0" :total="favourTotal" :page.sync="childRequestQuery.page"
					:limit.sync="childRequestQuery.pageSize" @pagination="getFavourIndicators" style="height: 65px;" />
			</el-tab-pane>

			<el-tab-pane label="我创建的" name="myCreated">
				<div class="search-container" style="margin-top: 5px;">
					<el-select v-model="childRequestQuery.indicatorType" placeholder="指标类型" clearable style="width: 150px;"
						class="search_item">
						<el-option v-for="item in types" :key="item.key" :label="item.value" :value="item.key" />
					</el-select>
					<el-select v-model="childRequestQuery.indicatorState" placeholder="指标状态" clearable class="search_item"
						style="width: 110px; margin-left: 10px;">
						<el-option v-for="item in states" :key="item.key" :label="item.value" :value="item.key" />
					</el-select>
					<el-link :underline="false" style="margin-left: 10px;" @click="resetRequestQuery()">重置<i
							class="el-icon-setting el-icon--right"></i></el-link>
					<el-button v-waves class="search-item" type="primary" icon="el-icon-search" @click="handleSearch"
						style="width: 80px; margin-left: 10px; padding: 7px 12px; border-radius: 3px;">
						搜索
					</el-button>
				</div>

				<el-table :key="tableKey" :data="createdIndicators" border fit highlight-current-row
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
					<el-table-column label="操作" align="center" width="225" class-name="small-padding fixed-width">
						<template slot-scope="{row,$index}">
							<el-button size="mini" @click.native.stop="handleEdit(row)">
								编辑
							</el-button>
							<el-button v-if="row.isCollect == true" size="mini"
								@click.native.stop="handleCancelFavour(row, $index)" type="warning">
								已收藏
							</el-button>
						</template>
					</el-table-column>
				</el-table>

				<pagination v-show="createdTotal >= 0" :total="createdTotal" :page.sync="childRequestQuery.page"
					:limit.sync="childRequestQuery.pageSize" @pagination="getCreatedIndicators" style="height: 65px;" />
			</el-tab-pane>
			<el-tab-pane label="个人信息" name="myInfo">

			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import { deleteCollection, getFavourIndicatorList, getCreateIndicatorList } from '@/api/dictionary';
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
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
	data() {
		return {
			tableKey: 0,
			activeName: 'myFavour',
			createdIndicators: [],
			createdTotal: 0,
			favourIndicators: [],
			favourTotal: 0,
			childRequestQuery: {
				needPage: true,
				page: 1,
				pageSize: 10,
				indicatorType: undefined,
				indicatorState: undefined,
			},
			types: [{ key: 0, value: "全部" }, { key: 1, value: "主原子指标" }, { key: 2, value: "衍生原子指标" }, { key: 3, value: "派生指标" }, { key: 4, value: "复合指标" }],
			states: [{ key: 0, value: "全部" }, { key: 1, value: "新建" }, { key: 2, value: "草稿" }, { key: 3, value: "已发布" }, { key: 4, value: "已下线" }],
		}
	},
	mounted() {
		this.getFavourIndicators();
		this.getCreatedIndicators();
	},
	methods: {
		getFavourIndicators() {
			this.childRequestQuery.needPage = true;
			getFavourIndicatorList(this.childRequestQuery).then(response => {
				this.favourIndicators = response.data.indicators.records
				this.favourTotal = response.data.indicators.total
			})
		},
		getCreatedIndicators() {
			this.childRequestQuery.needPage = true;
			getCreateIndicatorList(this.childRequestQuery).then(response => {
				this.createdIndicators = response.data.indicators.records
				this.createdTotal = response.data.indicators.total
			})
		},
		handleSearch() {
			this.childRequestQuery.needPage = true;
			getFavourIndicators(this.childRequestQuery).then(response => {
				this.favourIndicators = response.data.indicators.records
				this.favourTotal = response.data.indicators.total
			})
		},
		handleEdit(indicator) {
			this.$router.push({ path: '/indicator/dictionary/edit', query: { indicatorId: indicator.indicatorId } })
		},
		handleCancelFavour(row, index) {
			deleteCollection({ indicatorId: row.indicatorId }).then(response => {
				if (response.success) {
					this.users.splice(index, 1);
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
		showDetails(row) {
			this.$router.push({ path: '/indicator/dictionary/detail', query: { indicatorId: row.indicatorId } })
		},
		resetRequestQuery() {
			this.childRequestQuery = {
				needPage: true,
				page: 1,
				pageSize: 10,
				indicatorType: undefined,
				indicatorState: undefined,
			}
		},
		tableCellStyle() {
			return "border-color: #ddd;"
		},
		tableHeaderCellStyle() {
			return "border-color: #ddd;"
		},
	}
}

</script>

<style scoped>
.main_container {
	padding-top: 15px;
	padding-left: 25px;
	padding-right: 25px;
}


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
  