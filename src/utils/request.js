// axios 的封装处理
import axios from 'axios'
import { getToken, removeToken } from './token'
import router from '@/router'
// 根域名的配置

// 超时时间

// 请求拦截器 / 响应拦截器

const request = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})

request.interceptors.request.use(
  (config) => {
    // 获取token
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数

    // 监控 401 token 失效
    console.dir(error)
    if (error.response.status === 401) {
      removeToken()
      router.navigate('/login')
      window.location.reload()
    }
    return Promise.reject(error)
  }
)
export { request }
