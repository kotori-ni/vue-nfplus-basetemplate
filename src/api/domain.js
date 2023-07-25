import request from "@/utils/request";

//获取所有指标域
export function getAllDomainList(params) {
	return request({
		url: "/domain/all",
		method: "get",
		params: params
	});
}