import request from "@/utils/request";

export function getVersionList(params){
    return request({
        url: "/version/all",
        method: "get",
        params: params,
    });
}