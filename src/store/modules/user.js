/*
 * @Description: 全局用户信息,仅添加了用户注册的方法,其他方法没有做修改
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-13 10:28:16
 * @LastEditors: wch
 * @LastEditTime: 2023-08-14 14:33:01
 */

import { login, logout, getInfo, register } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
	return {
		token: getToken(),
		name: "",
		avatar: "@/assets/default_avatar.jpg",
	};
};

const state = getDefaultState();

const mutations = {
	RESET_STATE: (state) => {
		Object.assign(state, getDefaultState());
	},
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_NAME: (state, name) => {
		state.name = name;
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar;
	},
};

const actions = {
	// user login
	login({ commit }, userInfo) {
		console.log("user login")
		const { username, password } = userInfo;
		return new Promise((resolve, reject) => {
			login({ username: username.trim(), password: password })
				.then((response) => {
					const { data } = response;
					commit("SET_TOKEN", data.token);
					setToken(data.token);
					resolve();
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},

	//user register
	register({ commit }, userInfo) {
		const { username, password, email } = userInfo;
		return new Promise((resolve, reject) => {
			register({ username: username.trim(), password: password, email: email })
				.then((response) => {
					const { data } = response;
					commit("SET_TOKEN", data.token);
					setToken(data.token);
					resolve();
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},

	// get user infos
	getInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			getInfo(state.token)
				.then((response) => {
					const { data } = response;

					if (!data) {
						return reject("验证用户信息失败，请重新登录");
					}

					const { username } = data;
					//const { username, avatar } = data;

					commit("SET_NAME", username);
					//commit("SET_AVATAR", avatar);
					resolve(data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	// user logout
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
			logout(state.token)
				.then(() => {
					removeToken(); // must remove  token  first
					resetRouter();
					commit("RESET_STATE");
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	// remove token
	resetToken({ commit }) {
		return new Promise((resolve) => {
			removeToken(); // must remove  token  first
			commit("RESET_STATE");
			resolve();
		});
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
