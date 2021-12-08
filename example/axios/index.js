import axios from 'axios'
import signature from '../sign'

// 创建一个 axios 实例
const service = axios.create({
  baseURL: 'xxxxxxxxx.com',
  timeout: 1200, // 请求超时时间
  ithCredentials: true
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    return signature.sign(config)
  }
);

export default service
