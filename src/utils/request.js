import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    if (response.headers && (response.headers['content-type'] === 'application/octet-stream')) {
      if (response.data.errno === null || response.data.errno === undefined) {
        return response
      }
    }

    const res = response.data
    if (res.errno === 501) {
      MessageBox.alert('系统未登录，请重新登录', '未登录', {
        confirmButtonText: '确定',
        type: 'error'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      })
      return Promise.reject('error')
    } else if (res.errno === 502) {
      MessageBox.alert('系统内部错误，请联系管理员维护', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    } else if (res.errno === 503) {
      MessageBox.alert('请求业务目前未支持', '警告', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    } else if (res.errno !== 0) {
      return Promise.reject('error')
    } else {
      return response
    }
  }, error => {
    console.log('err' + error)// for debug
    Message({
      message: '登录连接超时（后台不能连接，请联系系统管理员）',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

/**
 * 封装导出Excal文件请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function exportError(url, data) {
  return new Promise((resolve, reject) => {
    alert(data.fileName)
    axios({
      method: 'get',
      url: 'http://localhost:8888/admin/upload/downloaderror', // 请求地址
      data: { fileName: 'cqsscError' }, // 参数
      responseType: 'blob' // 表明返回服务器返回的数据类型
    }).then(response => {
      const blob = new Blob([response.data], { type: 'application/octet-stream' })
      alert(blob)
      const fileName = data.fileName + '.txt'
      if (window.navigator.msSaveOrOpenBlob) {
        alert('1231')
        navigator.msSaveBlob(blob, fileName)
      } else {
        alert('67890')
        var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        window.URL.revokeObjectURL(link.href)
      }
    }, err => {
      console.log(err)
      reject(err)
    })
  })
}

export default service
