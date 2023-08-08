<template>
	<el-container style="height: calc(100vh - 50px); border: 1px solid #eee;" >
		<el-aside width="180px" style="background-color: rgb(255,255,255); border: 1px solid #eee">
			<sidebar :query="fatherRequestQuery" :pagesize="pagesize" @update="updateRequestQuery"></sidebar>
		</el-aside>

		<el-main>
			<ComplexTable :query="fatherRequestQuery" :pagesize="pagesize" @update="updateRequestQuery"></ComplexTable>
		</el-main>
	</el-container>
</template>

<script>
import sidebar from './components/sidebar.vue';
import ComplexTable from './components/complex-table.vue';
export default {
	components: {
		sidebar,
		ComplexTable,
	},
	data() {
		return {
			data: [],
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			pagesize: 10,
			fatherRequestQuery: {
				page: 1,
				pageSize: 10,
				needPage: true,
				domainId: undefined,
				creatorId: undefined,
				indicatorState: undefined,
				indicatorType: undefined,
				keyword: undefined,
				sortMethod: undefined
			},
		}
	},
	created() {
		this.fatherRequestQuery.pagesize = this.pagesize
	},
	methods: {
		resetRequestQuery() {
			this.fatherRequestQuery = {
				page: 1,
				pageSize: 10,
				needPage: true,
				creatorId: undefined,
				domainId: undefined,
				indicatorState: undefined,
				indicatorType: undefined,
				keyword: undefined,
				sortMethod: undefined
			}
			this.fatherRequestQuery.pagesize = this.pagesize
		},
		updateRequestQuery(query) {
			this.fatherRequestQuery = query
		},
		test() {
			console.log(this.fatherRequestQuery)
		}
	}
};
</script>

<style>
.el-header {
	background-color: rgb(255, 255, 255);
	color: #333;
	line-height: 60px;
}

.el-aside {
	color: #333;
}
</style>