<!--
 * @Description: 指标地图
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-13 10:28:16
 * @LastEditors: wch
 * @LastEditTime: 2023-08-24 12:39:47
-->

<template>
	<div class="main_container">
		<div class="title_map">
			<h3 style="font-size: 26px; margin-top: 15px; margin-bottom: 20px;">指标地图</h3>
			<div class="search">
				<el-input v-model="searchKeyword" clearable placeholder="输入指标名称搜索" @keyup.enter.native="handleSearch" style="width: 40%;"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
			</div>
		</div>
		<div class="information">
			<div class="indicator_card">
				<el-card class="box-card" style="margin-left: 5%; margin-right: 2%; height: 233px;">
					<div slot="header" class="clearfix">
						<span style="width: 85%;"><i class="el-icon-view" style="padding-right: 5px;"></i>热门浏览</span>
						<el-button style="float: right; padding: 3px 0" type="text" @click="handleView()">更多<i
								class="el-icon-arrow-right el-icon--right"></i></el-button>
					</div>
					<el-empty v-if="viewIndicators.length == 0" :image-size="80"></el-empty>
					<el-link v-for="indicator in viewIndicators" class="text item" @click="handleMore(indicator)">{{
						indicator.information }}</el-link>
				</el-card>
				<el-card class="box-card" style="margin-left: 2%; margin-right: 5%;	height: 233px;">
					<div slot="header" class="clearfix">
						<span style="width: 85%;"><i class="el-icon-star-on"
								style="padding-right: 5px; color: gold; font-size: 18px;"></i>我收藏的</span>
						<el-button style="float: right; padding: 3px 0" type="text" @click="handleUserDraft()">更多<i
								class="el-icon-arrow-right el-icon--right"></i></el-button>
					</div>
					<el-empty v-if="favourIndicators.length == 0" :image-size="80"></el-empty>
					<el-link v-for="indicator in favourIndicators" class="text item" @click="handleMore(indicator)">{{
						indicator.information }}</el-link>
				</el-card>
			</div>
			<div class="indicator_num">
				<el-row :gutter="20">
					<el-col :span="6" v-for="index of [0, 1, 2, 3]">
						<svg-icon :icon-class="iconClassNames[index]" style="font-size: 40px;"
							@click="handleRoute(routeAddressNames[index])"></svg-icon>
						<el-statistic group-separator="," :value="objects[index].value"
							:title="objects[index].label"></el-statistic>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="6" v-for="index of [4, 5, 6, 7]">
						<svg-icon :icon-class="iconClassNames[index]" style="font-size: 40px;"
							@click="handleRoute(routeAddressNames[index])"></svg-icon>
						<el-statistic group-separator="," :value="objects[index].value"
							:title="objects[index].label"></el-statistic>
					</el-col>
				</el-row>
			</div>
		</div>
		<div class="user">
			<el-card class="edit-card" style="width: 500px;">
				<div slot="header" class="clearfix">
					<span style="width: 85%;"><i class="el-icon-edit" style="padding-right: 5px;"></i>我的草稿</span>
					<el-button style="float: right; padding: 3px 0" type="text" @click="handleUserDraft()">更多<i
							class="el-icon-arrow-right el-icon--right"></i></el-button>
				</div>
				<el-empty v-if="editIndicators.length == 0" :image-size="100"></el-empty>
				<div v-for="indicator in editIndicators" class="edit_indicator">
					<el-link @click="handleMore(indicator)" style="margin-right: auto;">{{ indicator.information
					}}</el-link>
					<el-tag type="info" size="mini" style="margin-left: auto;">{{ indicator.lastOperateDay }}</el-tag>
				</div>
			</el-card>
			<el-card class="update-card" style="width: 700px;">
				<div slot="header" class="clearfix">
					<span style="width: 85%;"><i class="el-icon-document"
							style="padding-right: 5px; font-size: 18px;"></i>更新日志</span>
					<el-button style="float: right; padding: 3px 0" type="text">更多<i
							class="el-icon-arrow-right el-icon--right"></i></el-button>
				</div>
				<el-empty :image-size="100"></el-empty>
			</el-card>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getViewMaxIndicatorList, getIndicatorList, getFavourIndicatorList } from '@/api/dictionary';
import { getIndexInfo } from '@/api/user'

export default {
	name: 'Dashboard',
	computed: {
		...mapGetters([
			'name'
		])
	},
	data() {
		return {
			objects: [],
			routeAddressNames: ["/indicator/dictionary", "/indicator/dictionary", "/indicator/dictionary", "/indicator/dictionary", "/indicator/dictionary", "/words/derivation", "/words/modifier", "/words/timecycle"],
			iconClassNames: ["indicator_all", "indicator_atomic", "indicator_derivation", "indicator_modifier", "indicator_composite", "derivation", "modifier", "timecycle"],
			searchKeyword: undefined,
			editIndicators: [],
			viewIndicators: [],
			favourIndicators: [],
			indicatorQuery: {
				needPage: false,
				page: 1,
				pageSize: 10,
			}
		};
	},
	created() {
		for (let i = 0; i < 8; i++)
			this.objects.push({ value: 0, label: "" });
	},
	mounted() {
		this.getViewIndicators();
		this.getFavourIndicators();
		this.getCreateIndicators();
		this.getIndexInfos();
	},
	methods: {
		/**
		 * @description: 获取热门浏览指标
		 * @return {}
		 * @author: wch
		 */
		getViewIndicators() {
			getViewMaxIndicatorList().then(response => {
				this.viewIndicators = response.data.indicators;
				for (let i = 0; i < this.viewIndicators.length; i++) {
					this.viewIndicators[i].information = this.viewIndicators[i].indicatorName + " (" + this.viewIndicators[i].indicatorId + ")"
					if (this.viewIndicators[i].information.length > 29)
						this.viewIndicators[i].information = this.viewIndicators[i].information.substring(0, 29) + "..."
				}
			}).catch(error => {
				console.log(error);
			})
		},
		/**
		 * @description: 获取用户收藏的指标,只展示5个
		 * @return {*}
		 * @author: wch
		 */
		getFavourIndicators() {
			this.indicatorQuery.needPage = false
			getFavourIndicatorList(this.indicatorQuery).then(response => {
				this.favourIndicators = response.data.indicators.slice(0, 5)
				for (let i = 0; i < this.favourIndicators.length; i++) {
					this.favourIndicators[i].information = this.favourIndicators[i].indicatorName + " (" + this.favourIndicators[i].indicatorId + ")"
					if (this.favourIndicators[i].information.length > 29)
						this.favourIndicators[i].information = this.favourIndicators[i].information.substring(0, 29) + "..."
				}
			}).catch(error => {
				console.log(error);
			})
		},
		/**
		 * @description: 获取用户创建的指标,只展示5个
		 * @return {*}
		 * @author: wch
		 */
		getCreateIndicators() {
			this.indicatorQuery.needPage = false
			getIndicatorList(this.indicatorQuery).then(response => {
				this.editIndicators = response.data.indicators.filter(indicator => indicator.indicatorState == 2);
				this.editIndicators = this.editIndicators.slice(0, 5)
				for (let i = 0; i < this.editIndicators.length; i++) {
					this.editIndicators[i].information = this.editIndicators[i].indicatorName + " (" + this.editIndicators[i].indicatorId + ")"
					if (this.editIndicators[i].information.length > 29)
						this.editIndicators[i].information = this.editIndicators[i].information.substring(0, 49) + "..."
					this.editIndicators[i].lastOperateTime = new Date(this.editIndicators[i].lastOperateTime)
					var nowTime = new Date()
					var diffDays = (nowTime.getTime() - this.editIndicators[i].lastOperateTime.getTime()) / (1000 * 60 * 60 * 24)
					if (diffDays < 1)
						this.editIndicators[i].lastOperateDay = "最近编辑过"
					else
						this.editIndicators[i].lastOperateDay = Math.floor(diffDays) + "天前编辑过"
				}
			}).catch(error => {
				console.log(error);
			})
		},
		/**
		 * @description: 获取指标数量,衍生词,修饰词,时间周期数量信息
		 * @return {*}
		 * @author: wch
		 */
		getIndexInfos() {
			getIndexInfo().then(response => {
				this.objects = response.data.informations;
			}).catch(error => {
				console.log(error);
			})
		},
		handleRoute(path) {
			this.$router.push({ path: path })
		},
		handleSearch() {
			this.$router.push({ name: "指标字典", params: { searchKeyword: this.searchKeyword } })
		},
		handleUserDraft() {
			this.$router.push({ path: '/mydata' })
		},
		handleMore(indicator) {
			this.$router.push({ path: '/indicator/dictionary/detail', query: { indicatorId: indicator.indicatorId } })
		},
		handleView() {
			this.$router.push({ path: '/indicator/dictionary' })
		},
	},
}
</script>

<style>
.main_container {
	background-color: #f8f8f8;
	height: calc(100vh - 50px);
	display: flex;
	flex-direction: column;
}

.title_map {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 130px;
}

.title_map .search {
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 100%;
}

.information {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 250px;
}

.information .indicator_card {
	display: flex;
	flex-direction: row;
	width: 50%;
}

.information .indicator_num {
	width: 50%;
}

.indicator_num .el-row {
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 23px;
	height: 42%;
}

.indicator_num .el-row .el-col {
	width: 18%;
	height: 100%;
	margin-left: 3%;
	margin-right: 3%;
	padding-top: 10px;
	background-color: #fff;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}

.indicator_num .el-row .el-col .el-statistic .head {
	margin-top: 7px;
}

.text {
	font-size: 14px;
}

.item {
	margin-bottom: 15px;
}

.clearfix {
	width: 105%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: "";
}

.clearfix:after {
	clear: both;
}

.box-card {
	width: 43%;
	height: fit-content;
}

.box-card .el-card__header {
	padding-left: 15px;
	padding-right: 25px;
	padding-top: 16px;
	padding-bottom: 10px;
}

.box-card .el-card__body {
	padding-top: 18px;
	padding-left: 20px;
	padding-right: 10px;
	padding-bottom: 10px;
}

.user {
	flex-grow: 1;
	display: flex;
	flex-direction: row;
	margin-bottom: 20px;
}

.user .el-card {
	margin-left: 30px;
	height: 225px;
}

.user .edit-card .el-card__header {
	font-size: 13px;
	padding-top: 10px;
	padding-bottom: 10px;
}

.user .edit-card .el-card__body {
	padding-top: 18px;
	padding-bottom: 10px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.user .edit-card .el-card__body .edit_indicator {
	padding-bottom: 10px;
	display: flex;
	width: 100%;
}

.user .update-card .el-card__header {
	font-size: 13px;
	padding-top: 10px;
	padding-bottom: 10px;
}

.user .update-card .el-card__body {
	padding-top: 18px;
	padding-bottom: 10px;
}

.el-card__body .el-empty {
	padding-top: 0px;
	padding-bottom: 20px;
}
</style>
