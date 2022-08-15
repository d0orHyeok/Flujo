import axios, { AxiosInstance } from 'axios'
import qs from 'qs'

const Axios: AxiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/'
      : `${process.env.REACT_APP_API_URL}`,
  withCredentials: true,
})

Axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params)
}

Axios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401) {
      // 유저인증실패로 요청에 실패한경우
      if (originalRequest.url === '/api/auth/refresh') {
        return Promise.reject(error)
      } else {
        // refreshToken을 통해 accessToken 요청
        try {
          const response = await Axios.post('/api/auth/refresh')
          const { accessToken } = response.data
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          interceptWithAccessToken(accessToken)
          return axios(originalRequest)
        } catch (error) {
          // refreshToken을 통한 요청도 실패하면 그냥 실패
          return Promise.reject(error)
        }
      }
    }
    return Promise.reject(error)
  }
)

export const interceptWithAccessToken = (accessToken: string) => {
  // 요청전에 accessToken을 헤더에 담아준다.
  return Axios.interceptors.request.use(
    (config) => {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      }
      return config
    },
    (error) => {
      Promise.reject(error)
    }
  )
}

export default Axios
