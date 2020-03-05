import {
  request
} from "./request"
import Qs from 'qs'

//查询用户
export function usersRequest(pagenum, pagesize, query) {
  return request({
    url: "/users",
    params: {
      pagenum,
      pagesize,
      query
    }
  })
}

//添加用户
export function addUserRequest({
  username,
  password,
  email,
  mobile
}) {
  let data = Qs.stringify({
    'username': username,
    'password': password,
    'email': email,
    'mobile': mobile
  })
  return request({
    url: "/users",
    method: "post",
    data
  })
}

//删除用户
export function deleteUserRequest(id) {
  return request({
    url: `/users/${id}`,
    method: "delete",
  })
}

//修改用户状态
export function alterUserState(id, state) {
  return request({
    url: `/users/${id}/state/${state}`,
    method: "put",
  })
}

//根据 ID 查询用户信息
export function queryUserInfo(id) {
  return request({
    url: `/users/${id}`,
  })
}

//编辑用户信息
export function editUserInfo({
  id,
  email,
  mobile
}) {
  return request({
    url: `/users/${id}`,
    method: "put",
    data: {
      email,
      mobile
    }
  })
}

//分配用户角色
export function allotUserRole(id, rid) {
  let data = Qs.stringify({
    "rid": rid
  })
  return request({
    url: `/users/${id}/role`,
    method: "put",
    data
  })
}
