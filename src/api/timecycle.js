/*
 * @Description: 时间周期相关的接口
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-23 17:51:54
 * @LastEditors: wch
 * @LastEditTime: 2023-08-14 14:25:02
 */


import request from "@/utils/request";

/**
 * @description: 获取所有时间周期
 * @return {*}
 * @author: wch
 */
export function getTimeCycleList(){
	return request({
		url: "/timecycle/all",
		method: "get",
	});
}

/**
 * @description: 按条件获取时间周期
 * @param {*} data
 * @return {*}
 * @author: wch
 */
export function findTimeCycle(data){
	return request({
		url: "/timecycle/find",
		method: "post",
		data: data
	});
}

/**
 * @description: 获取引用了该时间周期的指标
 * @param {*} params
 * @return {*}
 * @author: wch
 */
export function findQuoteIndicators(params) {
	return request({
		url: "/timecycle/indicators",
		method: "get",
		params: params
	});
}

/**
 * @description: 添加时间周期
 * @param {*} data
 * @return {*}
 * @author: wch
 */
export function addTimeCycle(data){
	return request({
		url: "/timecycle/add",
		method: "post",
		data: data
	});
}

/**
 * @description: 批量添加时间周期
 * @param {*} data
 * @return {*}
 * @author: wch
 */
export function addTimeCycleList(data){
	return request({
		url: "/timecycle/batch_add",
		method: "post",
		data: data
	});
}

/**
 * @description: 更新时间周期
 * @param {*} data
 * @return {*}
 * @author: wch
 */
export function updateTimeCycle(data){
	return request({
		url: "/timecycle/update",
		method: "post",
		data: data
	});
}