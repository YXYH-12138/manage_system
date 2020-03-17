import {
  request
} from "./request"

export function getOrders(queryInfo) {
  return request({
    url: '/orders',
    params: {
      ...queryInfo
    }
  })
}

//查看物流信息
export function getConsigneeAddr() {
  return request({
    url: '/kuaidi/804909574412544580',
    // url: '/kuaidi/1106975712662',
  })
}
