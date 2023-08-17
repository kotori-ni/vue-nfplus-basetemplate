<!--
 * @Description: 指标域侧边栏组件
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-14 10:38:29
 * @LastEditors: wch
 * @LastEditTime: 2023-08-16 11:17:06
-->

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
					node-key="value" highlight-current check-on-click-node check-strictly prefix-icon="el-icon-search">
				</el-tree>
			</el-scrollbar>
		</el-main>
	</el-container>
</template>

<script>
import { getAllDomainList } from '@/api/domain.js'

export default {
	name: "siderbar",
	props: {
		query: {
			type: Object,
			default: () => {
				return {
					page: 1,
					pageSize: 10,
					needPage: true,
					creatorId: undefined,
					domainId: undefined,
					indicatorState: undefined,
					indicatorType: undefined,
					keyword: undefined,
					sortMethod: undefined
				};
			},
		},
		pageSize: {
			type: Number,
			default: 10
		}
	},
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
			childRequestQuery: {},
		};
	},
	mounted() {
		this.getDomainData(true, false);
		this.childRequestQuery = this.query;
	},
	watch: {
		query(newQuery) {
			this.childRequestQuery = newQuery
		},
		childRequestQuery(newQuery) {
			this.$emit('update', newQuery)
		}
	},
	methods: {
		/**
		 * @description: 获取选中的指标域结点id信息
		 * @return {*}
		 * @author: wch
		 */
		getCheckedKeys() {
			console.log(this.$refs.tree.getCheckedKeys().length)
			if (this.$refs.tree.getCheckedKeys().length > 0) {
				this.childRequestQuery.domainId = this.$refs.tree.getCheckedKeys()[0]
				this.$refs.tree.setCheckedKeys([]);
			}
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
		handleInputSelect(item) {
			this.childRequestQuery.domainId = item.value
		},
		/**
		 * @description: 获取所有指标域
		 * @param {*} needAll 是否需要"全部"这个结点
		 * @param {*} allowParent 父节点是否可选
		 * @return {*}
		 * @author: wch
		 */
		getDomainData(needAll, allowParent) {
			getAllDomainList({ needAll: needAll, allowParent: allowParent }).then(response => {
				this.tree_domains_data = response.data.domains;
				var labels = [];
				response.data.domains.forEach(function (domain) {
					if (domain.children) {
						domain.children.forEach(function (child) {
							labels.push({ "value": child.label, "id": child.value });
						});
					}
				});
				this.domains = labels;
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
	}
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
