import request from "@/utils/request";

//获取所有衍生词
export function getDerivativeList(params){
	return request({
		url: "/derivation/all",
		method: "get",
		params: params
	});
}