<template>
	<el-container>
		<el-header class="tree-header" style="height: auto;">
			<div style="flex-shrink: 0; height: 30px; width: 100%;">
				<el-button-group class="tree-buttons">
					<el-button class="sidebar-button" @click="handleClick_A" :type="button_A" size="medium">指标域</el-button>
					<el-button class="sidebar-button" @click="handleClick_B" :type="button_B" size="medium">资源目录</el-button>
				</el-button-group>
			</div>
			<div style="flex-grow: 1; height: 50px; width: 100%;"><el-autocomplete class="inline-input"
					v-model="search_domain" size="small" :fetch-suggestions="querySearch" suffix-icon="el-icon-search"
					placeholder="请输入指标域名称" @select="handleInputSelect"></el-autocomplete></div>
		</el-header>
		<el-main style="height: 100%; padding: 0px" class="main-tree">
			<el-scrollbar wrap-class="scrollbar">
				<el-tree :data="tree_domains_data" :props="defaultProps" @node-click="getCheckedKeys" ref="tree"
					node-key="id" highlight-current check-on-click-node check-strictly prefix-icon="el-icon-search">
				</el-tree>
			</el-scrollbar>
		</el-main>
	</el-container>
</template>

<script>
import { getAllDomainList, getChildDomainList } from '@/api/dictionary'
export default {
	name: "siderbar",
	data() {
		this.checkedId = 0
		return {
			button_A: "primary",
			button_B: "",
			search_domain: "",
			tree_domains_data: [],
			domains: [],
			defaultProps: {
				children: "children",
				label: "label",
			},
		};
	},
	methods: {
		getCheckedKeys() {
			console.log(this.$refs.tree.getCheckedKeys());
			this.$refs.tree.setCheckedKeys([]);
		},
		querySearch(queryString, cb) {
			var domains = this.domains;
			var results = queryString ? domains.filter(this.createFilter(queryString)) : domains;
			cb(results);
		},
		createFilter(queryString) {
			return (domain) => {
				return (domain.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
			};
		},
		handleInputSelect(item){
			console.log(item.id);
		},
		getData() {
			getAllDomainList().then(response => {
				this.tree_domains_data = response.data.domains;

				var labels = [];
				response.data.domains.forEach(function (domain) {
					if (domain.children) {
						domain.children.forEach(function (child) {
							labels.push({"value":child.label, "id":child.id});
						});
					}
				});
				this.domains = labels;
				console.log(this.domains);
			}).catch(error => {
				console.log(error);
			});
		},
		handleClick_A() {
			this.button_A = "primary";
			this.button_B = "";
		},
		handleClick_B() {
			this.button_A = "";
			this.button_B = "primary";
		},
	},
	mounted() {
		this.getData();
	},
};
</script>

<style>
.tree-header {
	padding: 0px;
	display: flex;
	align-items: center;
	flex-direction: column;
	margin-bottom: 0;
}

.tree-buttons {
	width: 100%;
	padding: 0px;
	margin-top: -25px;
}

.tree-buttons>.sidebar-button {
	width: 50%;
	border: 0px;
	border-radius: 0px;
}

.el-tree-node__content:hover {
	background-color: rgb(236, 245, 255);
}

.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
	background-color: rgb(200, 227, 255);
}

.inline-input {
	width: 100%;
	padding-left: 5px;
	padding-right: 5px;
}
</style>
