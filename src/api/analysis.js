import request from '@/utils/request'

export function listAnalysisResult(query) {
  return request({
    url: '/analiysis/list',
    method: 'get',
    params: query
  })
}

export function createAnalysisContent(data) {
  return request({
    url: '/analiysis/create',
    method: 'post',
    data
  })
}

export function readAnalysisContent(data) {
  return request({
    url: '/analiysis/read',
    method: 'get',
    data
  })
}

export function updateAnalysisContent(data) {
  return request({
    url: '/analiysis/update',
    method: 'post',
    data
  })
}

export function deleteAnalysisContent(data) {
  return request({
    url: '/analiysis/delete',
    method: 'post',
    data
  })
}
