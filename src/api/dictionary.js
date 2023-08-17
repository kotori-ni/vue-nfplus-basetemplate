/*
 * @Description: 指标相关的接口
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-13 10:28:16
 * @LastEditors: wch
 * @LastEditTime: 2023-08-16 11:09:07
 */


import request from "@/utils/request";

/**
 * @description: 获取所有指标创建者
 * @return {request}
 * @author: wch
 */
export function getCreatorList(params) {
	return request({
		url: "/indicator/creators",
		method: "get",
		params
	});
}

/**
 * @description: 按照条件获取指标
 * @param {data}
 * @return {request}
 * @author: wch
 */
export function getIndicatorList(data) {
	return request({
		url: "/indicator/find",
		method: "post",
		headers: { 'Content-Type': 'application/json' },
		data: data
	});
}

/**
 * @description: 按浏览量获取指标
 * @return {request}
 * @author: wch
 */
export function getViewMaxIndicatorList() {
	return request({
		url: "/indicator/viewmax",
		method: "get"
	});
}

/**
 * @description: 获取用户收藏的指标
 * @param {data}
 * @return {request}
 * @author: wch
 */
export function getFavourIndicatorList(data) {
	return request({
		url: "/indicator/favour",
		method: "post",
		data: data,
	});
}

/**
 * @description: 获取用户创建的指标
 * @param {data}
 * @return {request}
 * @author: wch
 */
export function getCreateIndicatorList(data) {
	return request({
		url: "/indicator/create",
		method: "post",
		data: data,
	});
}

/**
 * @description: 获取单个指标的详细信息
 * @return {request}
 * @author: wch
 */
export function getIndicatorDetail(params) {
	return request({
		url: "/indicator/one",
		method: "get",
		params: params
	});
}

/**
 * @description: 获取指标血缘树
 * @return {request}
 * @author: wch
 */
export function getIndicatorTree(params) {
	return request({
		url: "/indicator/indicator-tree",
		method: "get",
		params: params
	});
}

/**
 * @description: 新增指标
 * @param {data}
 * @return {request}
 * @author: wch
 */
export function addIndicator(data) {
	return request({
		url: "/indicator/add",
		method: "post",
		headers: { 'Content-Type': 'application/json' },
		data: data
	});
}

/**
 * @description: 更新指标状态
 * @return {request}
 * @author: wch
 */
export function changeState(params) {
	return request({
		url: "/indicator/update_state",
		method: "post",
		params: params
	});
}

/**
 * @description: 更新指标信息
 * @return {request}
 * @author: wch
 */
export function updateIndicator(data) {
	return request({
		url: "/indicator/update",
		method: "post",
		headers: { 'Content-Type': 'application/json' },
		data: data
	});
}

/**
 * @description: 删除指标
 * @return {*}
 * @author: wch
 */
export function deleteIndicator(param) {
	return request({
		url: "/indicator/delete",
		method: "delete",
		params: param
	});
}
