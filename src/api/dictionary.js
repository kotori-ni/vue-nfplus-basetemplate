import request from "@/utils/request";

//获取所有指标创建者
export function getCreatorList(params) {
	return request({
		url: "/indicator/creator_name",
		method: "get",
		params
	});
}

//按条件获取指标
export function getIndicatorList(data) {
	return request({
		url: "/indicator/find",
		method: "post",
		headers: { 'Content-Type': 'application/json' },
		data: data
	});
}

//获取单个指标的详细信息
export function getIndicatorDetail(params) {
	return request({
		url: "/indicator/detail",
		method: "get",
		params: params
	});
}

//新增指标
export function addIndicator(data) {
	return request({
		url: "/indicator/add",
		method: "post",
		headers: { 'Content-Type': 'application/json' },
		data: data
	});
}

//更新指标状态
export function changeState(params) {
	return request({
		url: "/indicator/changestate",
		method: "post",
		params: params
	});
}

//更新指标信息
export function updateIndicator(params, data) {
	return request({
		url: "/indicator/update",
		method: "post",
		headers: { 'Content-Type': 'application/json' },
		params: params,
		data: data
	});
}