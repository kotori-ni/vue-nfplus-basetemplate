import request from "@/utils/request";

//获取所有衍生词
export function getDerivationList(data){
	return request({
		url: "/derivation/all",
		method: "get",
		data: data
	});
}

// 分页查询衍生词
export function findDerivation(data){
	return request({
		url: "/derivation/find",
		method: "post",
		data: data
	});
}

// 添加衍生词
export function addDerivation(data){
	return request({
		url: "/derivation/add",
		method: "post",
		data: data
	});
}

//批量导入衍生词
export function addDerivationList(data){
	return request({
		url: "/derivation/batch_add",
		method: "post",
		data: data
	});
}

// 修改衍生词
export function updateDerivation(data){
	return request({
		url: "/derivation/update",
		method: "post",
		data: data
	});
}