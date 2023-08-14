/*
 * @Description: 修饰词相关的接口
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-07-23 17:47:20
 * @LastEditors: wch
 * @LastEditTime: 2023-08-14 14:23:46
 */


import request from "@/utils/request";

/**
 * @description: 获取所有修饰词
 * @return {*}
 * @author: wch
 */
export function getModifierList(params){
	return request({
		url: "/modifier/all",
		method: "get",
		params: params
	});
}

/**
 * @description: 按照条件获取修饰词
 * @param {*} data
 * @return {*}
 * @author: wch
 */
export function findModifier(data){
	return request({
		url: "/modifier/find",
		method: "post",
		data: data
	});
}

/**
 * @description: 获取引用该修饰词的指标
 * @return {request}
 * @author: wch
 */
export function findQuoteIndicators(params){
	return request({
		url: "/modifier/indicators",
		method: "get",
		params: params
	});
}

/**
 * @description: 添加修饰词
 * @return {*}
 * @author: wch
 */
export function addModifier(data){
	return request({
		url: "/modifier/add",
		method: "post",
		data: data
	});
}

/**
 * @description: 批量导入修饰词
 * @return {*}
 * @author: wch
 */
export function addModifierList(data){
	return request({
		url: "/modifier/batch_add",
		method: "post",
		data: data
	});
}

/**
 * @description: 修改修饰词
 * @return {*}
 * @author: wch
 */
export function updateModifier(data){
	return request({
		url: "/modifier/update",
		method: "post",
		data: data
	});
}

/**
 * @description: 删除修饰词
 * @return {*}
 * @author: wch
 */
export function deleteModifier(data){
	return request({
		url: "/modifier/delete",
		method: "post",
		data: data
	});
}
