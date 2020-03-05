import {
  request
} from "./request"

export function menusRequest() {
  return request({
    url: "/menus"
  })
}
