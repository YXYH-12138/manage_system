import {
  request
} from "./request"

export function getReports() {
  return request({
    url: '/reports/type/1'
  })
}
