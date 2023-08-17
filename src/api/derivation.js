/*
 * @Description: 衍生词相关的接口
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-23 17:49:29
 * @LastEditors: wch
 * @LastEditTime: 2023-08-15 16:18:31
 */

import request from "@/utils/request";

/**
 * @description: 获取所有衍生词
 * @param {data}
 * @return {request}
 * @author: wch
 */
export function getDerivationList(data){
	return request({
		url: "/derivation/all",
		method: "get",
		data: data
	});
}


/**
 * @description: 按条件获取衍生词
 * @param {data}
 * @return {request}
 * @author: wch
 */
export function findDerivation(data){
	return request({
		url: "/derivation/find",
		method: "post",
		data: data
	});
}

/**
 * @description: 获取引用了该衍生词的指标
 * @param {parmas} 
 * @return {request}
 * @author: wch
 */
export function findQuoteIndicators(parmas){
	return request({
		url: "/derivation/indicators",
		method: "get",
		params: parmas
	});
}

/**
 * @description: 添加衍生词
 * @param {data}
 * @return {request}
 * @author: wch
 */
// 添加衍生词
export function addDerivation(data){
	return request({
		url: "/derivation/add",
		method: "post",
		data: data
	});
}

/**
 * @description: 批量添加衍生词
 * @param {data}
 * @return {request} 
 * @author: wch
 */
export function addDerivationList(data){
	return request({
		url: "/derivation/batch_add",
		method: "post",
		data: data
	});
}

/**
 * @description: 修改衍生词
 * @param {data}
 * @return {request}
 * @author: wch
 */
// 修改衍生词
export function updateDerivation(data){
	return request({
		url: "/derivation/update",
		method: "post",
		data: data
	});
}

/**
 * @description: 删除衍生词
 * @param {params}
 * @return {*}
 * @author: wch
 */
export function deleteDerivation(params) {
	return request({
		url: "/derivation/delete",
		method: "delete",
		params: params
	});
}