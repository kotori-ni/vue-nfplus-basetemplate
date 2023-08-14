/*
 * @Description: 指标版本相关的接口
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-08-02 23:15:49
 * @LastEditors: wch
 * @LastEditTime: 2023-08-14 14:25:27
 */


import request from "@/utils/request";

export function getVersionList(params){
    return request({
        url: "/version/all",
        method: "get",
        params: params,
    });
}