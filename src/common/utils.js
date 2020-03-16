//时间格式化 yyyy-MM-dd HH-mm-ss
export function dateTimeFormat(date, format) {
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

export function deepCopy(copyObj, targetObj = {}) {
  Array.isArray(copyObj) && (targetObj = [])
  for (const [key, value] of Object.entries(copyObj)) {
    targetObj[key] = typeof value === 'object' ? deepCopy(value) : copyObj[key]
  }
  return targetObj
}

export class TreeData {
  //接受参数 ：树形数组，存储子节点的数组名字 默认为children
  constructor(treeArr, concatenateName = 'children') {
    this.treeArr = treeArr
    this.concatenateName = concatenateName
  }
  /*
   * 获得数组中的一些键值 结果为包含这些键值信息的数组
   * keys：字符串 或者 数组  eg:getSomeKeys("id") getSomeKeys(['id', "authName", "pid"])
   * isLastNode：是否只获取最后一个树节点的数据 默认为false
   */
  getSomeKeys(keys, isLastNode = false, arr = this.treeArr) {
    return arr.reduce((acc, cur) => {
      let o = ""
      if (Array.isArray(keys)) {
        o = {}
        keys.forEach(item => o[item] = cur[item])
      } else {
        o = cur[keys]
      }
      let cName = cur[this.concatenateName]
      return !isLastNode ? (cName ?
          acc.concat(o, this.getSomeKeys(keys, isLastNode, cName)) : acc.concat(o)) :
        acc.concat(cName ? this.getSomeKeys(keys, isLastNode, cName) : o)
    }, [])
  }

  findNodeData(byKey, byValue, arr = this.treeArr) {
    for (const [key, value] of arr.entries()) {
      if (value[byKey] === byValue) {
        return value
      }
      let cItme = value[this.concatenateName]
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
    for (const [key, value] of arr.entries()) {
      if (value[byKey] === byValue) {
        arr.splice(key, 1);
        return value
      }
      let cItme = value[this.concatenateName]
      if (cItme) {
        let result = this.deleteTreeNode(byKey, byValue, isDeleteParentNode, cItme)
        if (result) {
          isDeleteParentNode && value[this.concatenateName].length === 0 && arr.splice(key, 1);
          return result
        }
      }
    }
  }

  //将包含子节点的数组 转换成非嵌套的数组
  static parseList(arr, concatenateName = 'children') {
    return arr.reduce((acc, cur) => {
      let o = {}
      for (const [key, value] of Object.entries(cur)) {
        if (key != concatenateName) {
          o[key] = value
        }
      }
      return cur[concatenateName] ? acc.concat(o, this.parseList(cur[concatenateName], concatenateName)) : acc
        .concat(o)
    }, [])
  }
}
