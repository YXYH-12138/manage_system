import {
  request
} from "./request"
import Qs from 'qs'

//#region  商品分类管理

//商品分类管理数据
export function getGoodsCategory(pagenum, pagesize, type) {
  return request({
    url: "/categories",
    params: {
      pagenum,
      pagesize,
      type
    }
  })
}
//添加分类
export function addCategoryRequest(cat_pid, cat_name, cat_level) {
  return request({
    url: "/categories",
    data: {
      cat_pid,
      cat_name,
      cat_level
    },
    method: 'post'
  })
}
//删除分类
export function delCategoryRequest(id) {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  })
}
//根据 id 查询分类
export function getCategoryByid(id) {
  return request({
    url: `categories/${id}`,
  })
}
//编辑提交分类
export function editPutCategory(id, cat_name) {
  return request({
    url: `categories/${id}`,
    data: {
      cat_name
    },
    method: 'put'
  })
}

//#endregion

//#region  商品管理

//商品列表数据
export function getGoodsList(pagenum, pagesize, query) {
  return request({
    url: "/goods",
    params: {
      pagenum,
      pagesize,
      query
    }
  })
}
//删除商品
export function deleteGoodsRequest(id) {
  return request({
    url: `goods/${id}`,
    method: "delete"
  })
}
//添加商品
export function addGoodsRequest(data) {
  return request({
    url: `goods`,
    method: "post",
    data
  })
}
//#endregion

//#region  分类参数

//获得参数列表
export function getCategoryParams(id, sel = 'many') {
  // [only,many]
  return request({
    url: `categories/${id}/attributes`,
    params: {
      sel
    },
    method: 'get'
  })
}

// 添加动态参数或者静态属性
export function addCategoryParams(id, attr_name, attr_sel, attr_vals) {
  // [only,many]
  return request({
    url: `categories/${id}/attributes`,
    data: {
      attr_sel,
      attr_name,
      attr_vals
    },
    method: 'post'
  })
}

//编辑提交参数
export function editParams({
  attr_id,
  attr_name,
  attr_sel,
  attr_vals,
  cat_id
}) {
  return request({
    url: `categories/${cat_id}/attributes/${attr_id}`,
    data: {
      attr_name,
      attr_sel,
      attr_vals
    },
    method: 'put'
  })
}

//删除参数
export function deleteParams(id, attrid) {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: "delete"
  })
}

//根据 ID 查询参数
export function getParamsById({
  cat_id,
  attr_id,
  attr_sel,
  attr_vals
}) {
  return request({
    url: `categories/${cat_id}/attributes/${attr_id}`,
    method: "get",
    data: {
      attr_sel,
      attr_vals
    }
  })
}

//#endregion
