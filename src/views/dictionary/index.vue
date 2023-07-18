<template>
	<el-container style="height: calc(100vh - 50px); border: 1px solid #eee;" >
		<el-aside width="200px" style="background-color: rgb(255,255,255); border: 1px solid #eee">
			<sidebar></sidebar>
		</el-aside>

		<el-main>
			<ComplexTable></ComplexTable>
		</el-main>
	</el-container>
</template>

<script>
import sidebar from './components/sidebar.vue';
import ComplexTable from './components/complex-table.vue';
import test from './components/test.vue'
export default {
	components: {
		sidebar,
		ComplexTable,
		test
	},
	data() {
		return {
			data: [],
			defaultProps: {
				children: 'children',
				label: 'label'
			}
		}
	},
	methods: {
		handleNodeClick(data) {
			console.log(data);
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