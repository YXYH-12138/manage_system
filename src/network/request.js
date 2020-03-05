import Axios from "axios"

export function request(config) {
  const instance = Axios.create({
    baseURL: "http://127.0.0.1:8888/api/private/v1",
    timeout: 5000,
  })

  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })
  //请求拦截 添加token
  instance.interceptors.request.use(config => {
    config.headers.Authorization = sessionStorage.getItem("token")
    return config
  })
  return instance(config)
}
