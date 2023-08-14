<!--
 * @Description: 我的数据
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-13 18:12:28
 * @LastEditors: wch
 * @LastEditTime: 2023-08-14 15:17:07
-->

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
					<el-link :underline="false" style="margin-left: 10px;" @click="resetRequestQuery">重置<i
							class="el-icon-setting el-icon--right"></i></el-link>
					<el-button v-waves class="search-item" type="primary" icon="el-icon-search" @click="handleFavourSearch"
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
					<el-link :underline="false" style="margin-left: 10px;" @click="resetRequestQuery">重置<i
							class="el-icon-setting el-icon--right"></i></el-link>
					<el-button v-waves class="search-item" type="primary" icon="el-icon-search" @click="handleCreateSearch"
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
				<el-descriptions class="margin-top" title="基本资料" :column="2" border>
					<template slot="extra">
						<el-button type="primary" size="small" @click="dialogEditFromVisible = true">修改信息</el-button>
					</template>
					<el-descriptions-item>
						<template slot="label"><i class="el-icon-user"></i> 用户名</template>
						{{ user.username }}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"><i class="el-icon-mobile-phone"></i> 密码</template>
						{{ user.password }}
					</el-descriptions-item>
					<el-descriptions-item>
						<template slot="label"><i class="el-icon-message"></i> 邮箱</template>
						{{ user.email }}
					</el-descriptions-item>
				</el-descriptions>
			</el-tab-pane>
		</el-tabs>

		<el-dialog title="修改个人信息" :visible.sync="dialogEditFromVisible">
			<el-form ref="editForm" :rules="rules" :model="newUser" label-position="left" label-width="auto">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="newUser.username" placeholder="1-128个字符" maxlength="128" show-word-limit autosize
						type="textarea" />
				</el-form-item>
				<el-form-item label="新密码" prop="password">
					<el-input v-model="newUser.password" placeholder="1-128个字符" maxlength="128" show-word-limit autosize
						type="password" />
				</el-form-item>
				<el-form-item label="确认新密码" prop="rePassword">
					<el-input v-model="newUser.rePassword" placeholder="1-128个字符" maxlength="128" show-word-limit autosize
						type="password" />
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="newUser.email" placeholder="1-128个字符" maxlength="128" show-word-limit autosize
						type="textarea" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleBack">返回</el-button>
				<el-button type="primary" @click="updateUser">确认修改</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getFavourIndicatorList, getCreateIndicatorList } from '@/api/dictionary';
import { deleteCollection, getInfo, update } from '@/api/user';
import { getToken } from "@/utils/auth";
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
			dialogEditFromVisible: false,
			favourIndicators: [],
			favourTotal: 0,
			childRequestQuery: {
				needPage: true,
				page: 1,
				pageSize: 10,
				indicatorType: undefined,
				indicatorState: undefined,
			},
			user: {
				userId: '',
				username: '',
				password: '',
				email: '',
			},
			newUser: {
				userId: '',
				username: '',
				password: '',
				rePassword: '',
				email: '',
			},
			types: [{ key: 0, value: "全部" }, { key: 1, value: "主原子指标" }, { key: 2, value: "衍生原子指标" }, { key: 3, value: "派生指标" }, { key: 4, value: "复合指标" }],
			states: [{ key: 0, value: "全部" }, { key: 1, value: "新建" }, { key: 2, value: "草稿" }, { key: 3, value: "已发布" }, { key: 4, value: "已下线" }],
			rules: {
				username: [
					{ required: true, message: '请输入新用户名', trigger: 'blur' },
					{ min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入新密码', trigger: 'blur' },
					{ min: 6, max: 128, message: '长度在 6 到 128 个字符', trigger: 'blur' }
				],
				rePassword: [
					{ required: true, message: '请确认新密码', trigger: 'blur' },
					{ min: 6, max: 128, message: '长度在 6 到 128 个字符', trigger: 'blur' },
					{ validator: this.validateRePassword, trigger: 'blur' }
				],
				email: [
					{ min: 6, max: 128, message: '长度在 6 到 128 个字符', trigger: 'blur' }
				]
			}
		}
	},
	mounted() {
		this.getFavourIndicators();
		this.getCreatedIndicators();
		this.getUserInfo();
	},
	methods: {
		/**
		 * @description: 获取用户收藏的指标
		 * @return {*}
		 * @author: wch
		 */
		getFavourIndicators() {
			this.childRequestQuery.needPage = true;
			getFavourIndicatorList(this.childRequestQuery).then(response => {
				this.favourIndicators = response.data.indicators.records
				this.favourTotal = response.data.indicators.total
			})
		},
		/**
		 * @description: 获取用户创建的指标
		 * @return {*}
		 * @author: wch
		 */
		getCreatedIndicators() {
			this.childRequestQuery.needPage = true;
			getCreateIndicatorList(this.childRequestQuery).then(response => {
				this.createdIndicators = response.data.indicators.records
				this.createdTotal = response.data.indicators.total
			})
		},
		/**
		 * @description: 获取用户信息
		 * @return {*}
		 * @author: wch
		 */
		getUserInfo() {
			getInfo(getToken()).then(response => {
				this.user = response.data.user
				this.newUser.username = this.user.username
				this.newUser.password = this.user.password
				this.newUser.rePassword = this.user.password
				this.newUser.email = this.user.email
				this.newUser.userId = this.user.userId
			})
		},
		/**
		 * @description: 更新用户信息
		 * @return {*}
		 * @author: wch
		 */
		updateUser() {
			this.$refs['editForm'].validate((valid) => {
				if (valid) {
					this.newUser.userId = this.user.userId
					update(this.newUser).then(response => {
						if (response.success) {
							this.$notify({
								title: '操作成功',
								message: response.message,
								type: 'success',
								duration: 2000
							})
							this.user.username = this.newUser.username
							this.user.password = this.newUser.password
							this.user.email = this.user.email
							this.handleBack();
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
		validateRePassword(rule, value, callback) {
			if (value != this.newUser.password) {
				callback(new Error('两次输入的密码不一致'));
			} else {
				callback();
			}
		},
		handleBack() {
			this.dialogEditFromVisible = false;
			this.newUser = {
				username: this.user.username,
				password: "",
				rePassword: "",
				email: this.user.email,
			}
		},
		/**
		 * @description: 在用户收藏的指标按条件搜索
		 * @return {*}
		 * @author: wch
		 */
		handleFavourSearch() {
			this.childRequestQuery.needPage = true;
			getFavourIndicatorList(this.childRequestQuery).then(response => {
				console.log(response);
				this.favourIndicators = response.data.indicators.records
				this.favourTotal = response.data.indicators.total
			})
		},
		/**
		 * @description: 在用户创建的指标按条件搜索
		 * @return {*}
		 * @author: wch
		 */
		handleCreateSearch() {
			this.childRequestQuery.needPage = true;
			getCreateIndicatorList(this.childRequestQuery).then(response => {
				this.createdIndicators = response.data.indicators.records
				this.createdTotal = response.data.indicators.total
			})
		},
		handleEdit(indicator) {
			this.$router.push({ path: '/indicator/dictionary/edit', query: { indicatorId: indicator.indicatorId } })
		},
		/**
		 * @description: 取消收藏指标
		 * @param {*} row
		 * @param {*} index
		 * @return {*}
		 * @author: wch
		 */
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
			this.getCreatedIndicators();
			this.getFavourIndicators();
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
  