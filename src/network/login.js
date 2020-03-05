import {
  request
} from "./request"
import Qs from 'qs'

export function loginRequest(user, pwd) {
  let data = Qs.stringify({
    'username': user,
    'password': pwd
  })
  return request({
    url: "/login",
    method: "post",
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
