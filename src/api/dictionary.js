import request from "@/utils/request";

export function getAllDomainList(params) {
	return request({
		url: "/domain/all",
		method: "get",
		params
	});
}

export function getCreatorList(params) {
	return request({
		url: "/indicator/creator_name",
		method: "get",
		params
	});
}

export function getIndicatorList(data) {
	return request({
		url: "/indicator/find",
		method: "post",
		headers: { 'Content-Type': 'application/json' },
		data: data
	});
}

export function onlineIndicator(data, params) {
	return request({
		url: "/indicator/update",
		method: "post",
		headers: { 'Content-Type': 'application/json' },
		params : params,
		data: data
	});
}

export function offlineIndicator(data, params) {
	return request({
		url: "/indicator/update",
		method: "post",
		headers: { 'Content-Type': 'application/json' },
		params : params,
		data: data
	});
}