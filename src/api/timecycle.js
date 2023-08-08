import request from "@/utils/request";

//获取所有时间周期
export function getTimeCycleList(){
	return request({
		url: "/timecycle/all",
		method: "get",
	});
}

// 分页查询时间周期
export function findTimeCycle(data){
	return request({
		url: "/timecycle/find",
		method: "post",
		data: data
	});
}

// 添加时间周期
export function addTimeCycle(data){
	return request({
		url: "/timecycle/add",
		method: "post",
		data: data
	});
}

// 批量导入时间周期
export function addTimeCycleList(data){
	return request({
		url: "/timecycle/batch_add",
		method: "post",
		data: data
	});
}

// 修改时间周期
export function updateTimeCycle(data){
	return request({
		url: "/timecycle/update",
		method: "post",
		data: data
	});
}