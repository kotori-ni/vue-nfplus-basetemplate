<!--
 * @Description: 登录界面
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-13 10:28:16
 * @LastEditors: wch
 * @LastEditTime: 2023-08-14 15:13:24
-->

<template>
	<div class="login-container">
		<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
			label-position="left">

			<div class="title-container">
				<h3 class="title">南方+数据指标管理系统</h3>
			</div>

			<el-form-item prop="username">
				<span class="svg-container">
					<svg-icon icon-class="user" />
				</span>
				<el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" name="username" type="text"
					tabindex="1" auto-complete="on" />
			</el-form-item>

			<el-form-item prop="password">
				<span class="svg-container">
					<svg-icon icon-class="password" />
				</span>
				<el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
					placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
				<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
				</span>
			</el-form-item>

			<el-form-item prop="re_password" v-if="state == 'register'">
				<span class="svg-container">
					<svg-icon icon-class="password" />
				</span>
				<el-input :key="passwordType" ref="re_password" v-model="loginForm.re_password" :type="passwordType"
					placeholder="请确认密码" name="re_password" tabindex="2" auto-complete="on"
					@keyup.enter.native="handleLogin" />
				<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
				</span>
			</el-form-item>

			<el-form-item prop="email" v-if="state == 'register'">
				<span class="svg-container">
					<svg-icon icon-class="user" />
				</span>
				<el-input ref="email" v-model="loginForm.email" placeholder="请输入邮箱(可选)" name="email" type="text"
					tabindex="1" auto-complete="on" />
			</el-form-item>

			<el-button-group style="width: 100%; margin-bottom: 30px;" v-if="state == 'login'">
				<el-button :loading="loading" type="primary" style="width: calc(50% - 10px); border-radius: 0px;"
					@click.native.prevent="handleLogin">登录</el-button>
				<el-button :loading="loading" type="primary"
					style="width: calc(50% - 10px); margin-left: 20px; border-radius: 0px;"
					@click.native.prevent="state = 'register'">注册</el-button>
			</el-button-group>

			<el-button :loading="loading" type="primary" style="margin-bottom: 30px; width: 100%;"
				@click.native.prevent="handleRegister" v-if="state == 'register'">登录/注册</el-button>

		</el-form>
	</div>
</template>

<script>
export default {
	name: 'Login',
	data() {
		const validatePassword = (rule, value, callback) => {
			if (value.length < 6) {
				callback(new Error('密码长度不能小于6位'))
			} else {
				callback()
			}
		}
		return {
			loginForm: {
				username: '',
				password: '',
				re_password: '',
				email: '',
			},
			loginRules: {
				username: [{ required: true }],
				password: [{ required: true, trigger: 'blur', validator: validatePassword }],
				re_password: [{ trigger: 'blur', validator: this.state == 'register' ? validateRePassword : null }]
			},
			loading: false,
			passwordType: 'password',
			state: "login",
			redirect: undefined,
			validateRePassword: (rule, value, callback) => {
				if (value != this.loginForm.password) {
					callback(new Error('两次输入的密码不一致'))
				} else {
					callback()
				}
			}
		}
	},
	watch: {
		$route: {
			handler: function (route) {
				this.redirect = route.query && route.query.redirect
			},
			immediate: true
		}
	},
	methods: {
		showPwd() {
			if (this.passwordType === 'password') {
				this.passwordType = ''
			} else {
				this.passwordType = 'password'
			}
			this.$nextTick(() => {
				this.$refs.password.focus()
			})
		},
		/**
		 * @description: 用户登录
		 * @return {*}
		 * @author: wch
		 */
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true
					this.$store.dispatch('user/login', this.loginForm).then(() => {
						this.$router.push({ path: this.redirect || '/' })
						this.loading = false
					}).catch(() => {
						this.loading = false
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		/**
		 * @description: 用户注册
		 * @return {*}
		 */
		handleRegister() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true
					this.$store.dispatch('user/register', this.loginForm).then(() => {
						this.$router.push({ path: this.redirect || '/' })
						this.loading = false
						this.$notify({
							title: '注册成功',
							message: '即将跳转到首页',
							type: 'success',
							duration: 2000
						})
					}).catch(() => {
						this.loading = false
					})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		}
	},
	watch: {
		state(newValue) {
			if (newValue == 'register') {
				this.loginRules.re_password[0].validator = this.validateRePassword;
			} else {
				this.loginRules.re_password[0].validator = null;
			}
		}
	},
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
	.login-container .el-input input {
		color: $cursor;
	}
}

/* reset element-ui css */
.login-container {
	.el-input {
		display: inline-block;
		height: 47px;
		width: 85%;

		input {
			background: transparent;
			border: 0px;
			-webkit-appearance: none;
			border-radius: 0px;
			padding: 12px 5px 12px 15px;
			color: $light_gray;
			height: 47px;
			caret-color: $cursor;

			&:-webkit-autofill {
				box-shadow: 0 0 0px 1000px $bg inset !important;
				-webkit-text-fill-color: $cursor !important;
			}
		}
	}

	.el-form-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.1);
		border-radius: 5px;
		color: #454545;
	}
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
	min-height: 100%;
	width: 100%;
	background-color: $bg;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;

	.login-form {
		position: relative;
		width: 520px;
		max-width: 100%;
		padding: 0px 35px 20px;
		margin: 0 auto;
		overflow: hidden;
	}

	.tips {
		font-size: 14px;
		color: #fff;
		margin-bottom: 10px;

		span {
			&:first-of-type {
				margin-right: 16px;
			}
		}
	}

	.svg-container {
		padding: 6px 5px 6px 15px;
		color: $dark_gray;
		vertical-align: middle;
		width: 30px;
		display: inline-block;
	}

	.title-container {
		position: relative;

		.title {
			font-size: 26px;
			color: $light_gray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}
	}

	.show-pwd {
		position: absolute;
		right: 10px;
		top: 7px;
		font-size: 16px;
		color: $dark_gray;
		cursor: pointer;
		user-select: none;
	}
}
</style>
