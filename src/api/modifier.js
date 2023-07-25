import request from "@/utils/request";

//获取所有修饰词
export function getModifierList(params){
	return request({
		url: "/modifier/all",
		method: "get",
		params: params
	});
}