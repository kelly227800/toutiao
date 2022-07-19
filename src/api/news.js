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
