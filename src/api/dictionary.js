import request from "@/utils/request";

//获取所有指标创建者
export function getCreatorList(params) {
	return request({
		url: "/indicator/creators",
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

//获取浏览量最多的五个指标
export function getViewMaxIndicatorList() {
	return request({
		url: "/indicator/viewmax",
		method: "get"
	});
}

//获取用户收藏的指标
export function getFavourIndicatorList(data) {
	return request({
		url: "/indicator/favour",
		method: "post",
		data: data,
	});
}

//获取用户创建的指标
export function getCreateIndicatorList(data) {
	return request({
		url: "/indicator/creator",
		method: "post",
		data: data,
	});
}

//获取单个指标的详细信息
export function getIndicatorDetail(params) {
	return request({
		url: "/indicator/one",
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
		url: "/indicator/update_state",
		method: "post",
		params: params
	});
}

//更新指标信息
export function updateIndicator(data) {
	return request({
		url: "/indicator/update",
		method: "post",
		headers: { 'Content-Type': 'application/json' },
		data: data
	});
}