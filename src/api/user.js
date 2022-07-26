import request from '@/utils/request'
export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })
}
/**
 * 发送短信验证码
 * @param {*} mobile 手机号
 * @returns promise
 */
export const sendCode = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}
/**
 * 获取用户信息
 * @returns promise
 */
export const getUserInfo = () => {
  return request({
    url: '/v1_0/user'
  })
}
/**
 * 获取用户个人资料
 * @returns promise
 */
export const getMyInformation = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}
/**
 * 编辑用户个人资料
 * @param {*} name 昵称
 * @param {*} gender 性别 0-男 1-女
 * @param {*} birthday 生日 格式'2018-12-20'
 * @returns promise
 */
export const EditUserInfo = (obj) => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: { name: obj.name, gender: obj.gender, birthday: obj.birthday }
  })
}
/**
 * 关注用户
 * @param {*} target 关注用户的id
 * @returns promise
 */
export const followUser = (target) => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: { target }
  })
}

/**
 * 取消关注
 * @param {*} target 被取消关注的用户id
 * @returns promise
 */
export const deleteFollow = (target) => {
  return request({
    url: `/v1_0/user/followings/${target}`,
    method: 'DELETE'
  })
}
/**
 *
 * @param {*} file 图片的FORM DATA
 * @returns
 */
export const uploadPhoto = (file) => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: file
  })
}
/**
 * 刷新用户token
 * @returns promise
 */
export const refreshToken = (refreshToken) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'PUT',
    headers: { Authorization: refreshToken }
  })
}
