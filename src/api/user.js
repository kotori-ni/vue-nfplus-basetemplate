/*
 * @Description: 用户模块相关的接口
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-13 10:28:16
 * @LastEditors: wch
 * @LastEditTime: 2023-08-14 14:29:15
 */

import request from "@/utils/request";

/**
 * @description: 用户登录
 * @param {*} data
 * @return {*}
 * @author: wch
 */
export function login(data) {
	return request({
		url: "/user/login",
		method: "post",
		data,
	});
}

/**
 * @description: 用户注册
 * @param {*} data
 * @return {*}
 * @author: wch
 */
export function register(data) {
	return request({
		url: "/user/register",
		method: "post",
		data: data,
	})
}

/**
 * @description: 获取用户信息
 * @param {*} token
 * @return {*}
 * @author: wch
 */
export function getInfo(token) {
	return request({
		url: "/user/user-info",
		method: "get",
		params: { token },
	});
}

/**
 * @description: 更新用户信息
 * @param {*} data
 * @return {*}
 * @author: wch
 */
export function update(data){
	return request({
		url: "/user/update",
		method: "post",
		data: data,
	})
}

/**
 * @description: 用户退出登录
 * @param {*} token
 * @return {*}
 * @author: wch
 */
export function logout(token) {
	return request({
		url: "/user/logout",
		method: "post",
		params: { token: token },
	});
}

/**
 * @description: 添加收藏
 * @param {*} data
 * @return {*}
 * @author: wch
 */
export function addCollection(data) {
	return request({
		url: "/collection/add",
		method: "post",
		data: data,
	});
}

/**
 * @description: 取消收藏
 * @param {*} data
 * @return {*}
 * @author: wch
 */
export function deleteCollection(data) {
	return request({
		url: "/collection/delete",
		method: "post",
		data: data,
	});
}

/**
 * @description: 获取用户首页信息
 * @return {*}
 * @author: wch
 */
export function getIndexInfo() {
	return request({
		url: "/user/index-info",
		method: "get",
	});
}