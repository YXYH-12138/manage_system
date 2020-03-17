import {
  request
} from "./request"

// 权限列表
export function getRightsList(type = 'list') {
  return request({
    url: `rights/${type}`,
  })
}

/**
 * 角色列表相关请求
 */

//角色列表数据
export function getRolesList() {
  return request({
    url: "roles",
  })
}
//添加角色
export function addRoleRequest({
  roleName,
  roleDesc
}) {
  return request({
    url: "roles",
    method: "post",
    data: {
      roleName,
      roleDesc
    }
  })
}
//根据 ID 查询角色
export function queryRole(id) {
  return request({
    url: `roles/${id}`,
  })
}
//编辑提交角色
export function editRolePut({
  roleId,
  roleName,
  roleDesc
}) {
  return request({
    url: `roles/${roleId}`,
    method: "put",
    data: {
      roleName,
      roleDesc
    }
  })
}
//删除角色
export function deleteRoleRequest(id) {
  return request({
    url: `/roles/${id}`,
    method: "delete",
  })
}
//角色授权
export function editRoleRights(roleId, rids) {
  return request({
    url: `roles/${roleId}/rights`,
    method: "post",
    data: {
      rids
    }
  })
}
//删除角色指定权限
export function deleteRoleRights(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: "delete",
  })
}
