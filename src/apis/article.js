import { request } from '@/utils'

export const getChannelsAPI = () => {
  return request({
    url: '/channels',
    method: 'GET'
  })
}

export const addArticleAPI = (formData, draft) => {
  return request({
    url: '/mp/articles',
    method: 'POST',
    data: formData,
    // post请求查询参数
    params: {
      draft
    }
  })
}
