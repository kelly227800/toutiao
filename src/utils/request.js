import axios from 'axios'
import store from '@/store'
// import { Toast } from 'vant'
// import { refreshToken } from '@/api'
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
// request.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error) => {
//     if (error.message.includes('timeout')) {
//       // 判断请求异常信息中是否含有超时timeout字符串
//       Toast.fail('请求超时，请稍后再试')
//       return Promise.reject(error) // reject这个错误信息
//     }
//   }
// )
// const requestFreshToken = axios.create()
// request.interceptors.response.use(
//   (response) => {
//     console.log(response)
//     return response
//   },
//   async (error) => {
//     console.log(error.response)
//     const status = error.response.status
//     if (status === 401) {
//       const { user } = store.state
//       if (!user || !user.refresh_token) {
//         return this.$router.push('/login')
//       }
//       try {
//         const data = await requestFreshToken({
//           method: 'PUT',
//           url: '',
//           headers: {}
//         })
//         user.token = data.data.token
//         store.commit('setUser', user)
//         return request(error.response.config)
//       } catch (err) {}
//       return this.$router.push('/login')
//       // Toast.fail('用户认证失败')
//     } else {
//       Toast.fail('请求失败，请稍后再试')
//     }
//   }
// )

export default request
