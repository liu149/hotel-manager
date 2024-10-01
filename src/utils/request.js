// api.js
import axios from 'axios';
import { BASE_API_URL } from '../api/config';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: BASE_API_URL, // 基础URL
  timeout: 20000, // 超时时间
});


export default apiClient;
