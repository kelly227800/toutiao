import request from '@/utils/request'
/**
 * 获取评论
 * @param {*} source 文章id
 * @returns promise
 */
export const getCommentList = (source, offset) => {
  return request({
    url: '/v1_0/comments',
    params: { type: 'a', source, offset }
  })
}
/**
 * 获取评论回复
 * @param {*} source 评论id
 * @returns promise
 */
export const getReplyList = (source, offset) => {
  return request({
    url: '/v1_0/comments',
    params: { type: 'c', source, offset }
  })
}
/**
 * 评论文章
 * @param {*} target 文章id
 * @param {*} content 评论内容
 * @returns promise
 */
export const CommentArticle = (target, content, artId) => {
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: { target, content, art_id: artId }
  })
}
/**
 * 对评论或评论回复点赞
 * @param {*} target 点赞的评论id
 * @returns promise
 */
export const LikeComment = (target) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: { target }
  })
}
/**
 * 取消对评论或评论回复点赞
 * @param {*} target 取消点赞的评论id
 * @returns promise
 */
export const cancelLikeComment = (target) => {
  return request({
    url: `/v1_0/comment/likings/${target}`,
    method: 'DELETE'
  })
}
