import {
  request
} from "./request"

export function usersRequest(pagenum, pagesize) {
  return request({
    url: "/users",
    params: {
      pagenum,
      pagesize
    }
  })
}
