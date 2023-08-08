import request from "@/utils/request";

//获取所有修饰词
export function getModifierList(params){
	return request({
		url: "/modifier/all",
		method: "get",
		params: params
	});
}

// 分页查询修饰词
export function findModifier(data){
	return request({
		url: "/modifier/find",
		method: "post",
		data: data
	});
}

// 添加修饰词
export function addModifier(data){
	return request({
		url: "/modifier/add",
		method: "post",
		data: data
	});
}

//批量导入修饰词
export function addModifierList(data){
	return request({
		url: "/modifier/batch_add",
		method: "post",
		data: data
	});
}

// 修改修饰词
export function updateModifier(data){
	return request({
		url: "/modifier/update",
		method: "post",
		data: data
	});
}

// 删除修饰词
export function deleteModifier(data){
	return request({
		url: "/modifier/delete",
		method: "post",
		data: data
	});
}
