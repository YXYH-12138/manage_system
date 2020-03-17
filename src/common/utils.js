//时间格式化 yyyy/MM/dd HH:mm:ss
export function dateTimeFormat(date, format = 'yyyy/MM/dd HH:mm:ss') {
  date = new Date(date)
  let year = date.getFullYear().toString();
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, year.substring(4 - RegExp.$1.length))
  }
  let objDate = {
    'MM': date.getMonth() + 1,
    'dd': date.getDate(),
    'hh': date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
    'HH': date.getHours(),
    'mm': date.getMinutes(),
    'ss': date.getSeconds()
  }
  for (let o in objDate) {
    if (new RegExp(`(${o})`).test(format)) {
      format = format.replace(RegExp.$1, objDate[o].toString().padStart(2, '0'));
    }
  }
  return format
}

//对象深拷贝
export function deepCopy(copyObj, targetObj = {}) {
  Array.isArray(copyObj) && (targetObj = [])
  for (const [key, value] of Object.entries(copyObj)) {
    targetObj[key] = typeof value === 'object' ? deepCopy(value) : copyObj[key]
  }
  return targetObj
}

export class TreeData {
  //接受参数 ：树形数组，存储子节点的数组名字 默认为children
  constructor(treeArr, children = 'children') {
    this.treeArr = treeArr
    this.children = children
  }
  /*
   * 获得数组存贮的对象中的一个或多个键值 结果为包含这些键值信息的数组
   * keys：字符串 或者 数组  eg:getSomeKeys("id") getSomeKeys(['id', "authName", "pid"])
   * isLastNode：是否只获取最后一个树节点的数据 默认为false
   */
  getSomeDataByKeys(keys, isLastNode = false, arr = this.treeArr) {
    return arr.reduce((acc, cur) => {
      let o = ""
      if (Array.isArray(keys)) {
        o = {}
        keys.forEach(item => o[item] = cur[item])
      } else {
        o = cur[keys]
      }
      let cName = cur[this.children]
      return !isLastNode ? (cName ?
          acc.concat(o, this.getSomeDataByKeys(keys, isLastNode, cName)) : acc.concat(o)) :
        acc.concat(cName ? this.getSomeDataByKeys(keys, isLastNode, cName) : o)
    }, [])
  }

  findNodeData(byKey, byValue, arr = this.treeArr) {
    for (const [key, value] of arr.entries()) {
      if (value[byKey] === byValue) {
        return value
      }
      let cItme = value[this.children]
      if (cItme) {
        let result = this.findNodeData(byKey, byValue, cItme)
        if (result) return result
      }
    }
  }
  /*
   * 删除某一节点 并返回被删除的节点
   * byKey: 节点的某一个键
   * byValue: 键所对应的值 确定该值存在
   * isDeleteParentNode : 是否当父节点没有子节点时将父节点也删除 默认删除
   */
  deleteTreeNode(byKey, byValue, isDeleteParentNode = true, arr = this.treeArr) {
    return arr.reduce((acc, cur, index) => {
      cur[byKey] === byValue && acc.push(...arr.splice(index, 1));
      if (cur[this.children]) {
        acc.push(...this.deleteTreeNode(byKey, byValue, isDeleteParentNode, cur[this.children]))
        isDeleteParentNode && cur[this.children].length === 0 && acc.push(...arr.splice(index, 1));
      }
      return acc
    }, []);
  }
  /*
   *  将包含子节点的数组 转换成非嵌套的数组  
   *  depth: 遍历层数  传入Infinity则可以展开全部
   *  isList:  默认将展开数组
   */
  treeFlat(depth, isList = true, arr = this.treeArr) {
    return arr.reduce((acc, cur) => {
      let o = {}
      for (let [key, value] of Object.entries(cur)) {
        if (key !== this.children) {
          o[key] = value
        } else if (depth > 1) {
          isList ? acc.push(...this.treeFlat(depth - 1, isList, value)) :
            o[this.children] = this.treeFlat(depth - 1, isList, value)
        }
      }
      return acc.concat(o)
    }, [])
  }
  /*
   *  添加节点
   *  pIdName: 父id名称   pId: 父pIdName所对应的值  确保id的唯一性
   *  data 要添加的数据
   */
  addTreeNode(pIdName, pId, data, arr = this.treeArr) {
    for (const [key, value] of Object.entries(arr)) {
      if (value[pIdName] === pId) {
        value[this.children] || (value[this.children] = [])
        value[this.children].push(data)
        return
      }
      value[this.children] && this.addTreeNode(pIdName, pId, data, value[this.children])
    }
  }
}