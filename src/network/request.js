import Axios from "axios"
//导入进度条插件
import NProgress from "nprogress"
import "nprogress/nprogress.css"

export function request(config) {
  const instance = Axios.create({
    // baseURL: "http://127.0.0.1:8888/api/private/v1",
    baseURL: "https://www.liulongbin.top:8888/api/private/v1",
    timeout: 5000,
  })

  instance.interceptors.response.use(res => {
    //进度条开始
    NProgress.start()
    return res.data
  }, err => {
    console.log(err);
  })
  //请求拦截 添加token
  instance.interceptors.request.use(config => {
    //进度条关闭
    NProgress.done()
    config.headers.Authorization = sessionStorage.getItem("token")
    return config
  })
  return instance(config)
}
