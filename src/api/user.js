import request from "@/utils/request";

export function login(data) {
	return request({
		url: "/user/login",
		method: "post",
		data,
	});
}

export function getInfo(token) {
	return request({
		url: "/user/user-info",
		method: "get",
		params: { token },
	});
}

export function logout(token) {
	return request({
		url: "/user/logout",
		method: "post",
		params: { token: token },
	});
}

export function addCollection(data) {
	return request({
		url: "/collection/add",
		method: "post",
		data: data,
	});
}

export function deleteCollection(data) {
	return request({
		url: "/collection/delete",
		method: "post",
		data: data,
	});
}

//获取用户首页信息
export function getIndexInfo() {
	return request({
		url: "/user/index-info",
		method: "get",
	});
}

