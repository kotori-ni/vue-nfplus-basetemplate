import request from "@/utils/request";

//获取所有时间周期
export function getTimeCycleList(params){
	return request({
		url: "/timecycle/all",
		method: "get",
		params: params
	});
}