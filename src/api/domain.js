/*
 * @Description: 指标域相关的接口
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-23 17:53:03
 * @LastEditors: wch
 * @LastEditTime: 2023-08-14 14:20:43
 */


import request from "@/utils/request";

/**
 * @description: 获取所有指标域
 * @return {request}
 * @author: wch
 */
export function getAllDomainList(params) {
	return request({
		url: "/domain/all",
		method: "get",
		params: params
	});
}

/**
 * @description: 获取指标域中的所有指标
 * @return {request}
 * @author: wch
 */
export function findQuoteIndicators(params) {
	return request({
		url: "/domain/indicators",
		method: "get",
		params: params
	});
}

/**
 * @description: 新增指标域
 * @return {*}
 * @author: wch
 */
export function addDomain(data) {
	return request({
		url: "/domain/add",
		method: "post",
		data: data
	});
}

/**
 * @description: 编辑指标域
 * @return {*}
 * @author: wch
 */
export function updateDomain(data) {
	return request({
		url: "/domain/update",
		method: "post",
		data: data
	});
}

/**
 * @description: 删除指标域
 * @return {*}
 * @author: wch
 */
export function deleteDomain(params) {
	return request({
		url: "/domain/delete",
		method: "delete",
		params: params
	});
}

