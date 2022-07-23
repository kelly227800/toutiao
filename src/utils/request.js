import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 3000
})
request.interceptors.request.use(
  (config) => {
    // console.log(config)
    const token = store.state.user.token
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
    return response
  },
  (error) => {
    if (error.message.includes('timeout')) {
      // 判断请求异常信息中是否含有超时timeout字符串
      Toast.fail('请求超时，请稍后再试')
      return Promise.reject(error) // reject这个错误信息
    }
    Toast.fail('网络连接失败，请稍后再试')
    return Promise.reject(error)
  }
)

export default request
