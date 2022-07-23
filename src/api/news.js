import request from '@/utils/request'

/**
 *
 * @param {*} channelID 频道的id
 * @param {*} timestamp 获取第一页的文章
 * @returns Promise
 */

export const getArticleList = (channelID, timestamp) => {
  return request({
    url: '/v1_0/articles/',
    params: {
      channel_id: channelID,
      timestamp
    }
  })
}
/**
 * 获取文章详情
 * @param {*} id 文章id
 * @returns Promise
 */
export const getArticleDetail = (id) => {
  return request({
    url: `/v1_0/articles/${id}`
  })
}
/**
 * 收藏文章
 * @param {*} target 收藏的目标文章id
 * @returns Promise
 */
export const collectArticle = (target) => {
  return request({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: { target }
  })
}
/**
 * 取消收藏文章
 * @param {*} target 取消收藏的文章id
 * @returns Promise
 */
export const cancelCollections = (target) => {
  return request({
    url: `/v1_0/article/collections/${target}`,
    method: 'DELETE'
  })
}
/**
 * 点赞文章
 * @param {*} target 点赞的文章id
 * @returns Promise
 */
export const likeArticle = (target) => {
  return request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: { target }
  })
}
/**
 * 取消点赞文章
 * @param {*} target 取消点赞的文章id
 * @returns Promise
 */
export const cancelLikeings = (target) => {
  return request({
    url: `/v1_0/article/likings/${target}`,
    method: 'DELETE'
  })
}
