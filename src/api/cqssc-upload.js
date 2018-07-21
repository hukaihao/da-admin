// import { request, exportError } from '@/utils/request'
import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: '/upload/cqssc',
    method: 'post',
    timeout: 20000,
    data
  })
}

export function downErrorFile(query) {
  return request({
    url: '/upload/downloaderror',
    method: 'get',
    timeout: 20000,
    responseType: 'blob',
    params: query
  })
}

