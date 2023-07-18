import request from "@/utils/request";

export function getAllDomainList(params) {
	return request({
		url: "/domain/all",
		method: "get",
		params,
	});
}