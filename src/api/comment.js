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
 * 评论文章
 * @param {*} target 文章id
 * @param {*} content 评论内容
 * @returns promise
 */
export const CommentArticle = (target, content) => {
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: { target, content }
  })
}
