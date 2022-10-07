import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import qs from 'qs'

export type AxiosConfig = AxiosRequestConfig<any | undefined>

const Axios: AxiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/'
      : 'https://wave-nestjs.herokuapp.com/',
  withCredentials: true,
})

Axios.interceptors.request.use((config) => {
  if (process.env.NODE_ENV !== 'development') {
    config.url = config.url?.replace('/api/', '/')
    const reqAuth = localStorage.getItem('wave_login') !== 'false'
    if (!reqAuth && Boolean(config.url?.includes('/auth/info'))) {
      return
    }
  }
  return config
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
      const reqAuth = localStorage.getItem('wave_login') !== 'false'

      if (originalRequest.url.includes('/auth/refresh') !== -1 || !reqAuth) {
        return Promise.reject(error)
      } else {
        // refreshToken을 통해 accessToken 요청
        try {
          const response = await Axios.post('/api/auth/refresh')
          localStorage.setItem('wave_login', 'true')
          const { accessToken } = response.data
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          interceptWithAccessToken(accessToken)
          return axios(originalRequest)
        } catch (error) {
          // refreshToken을 통한 요청도 실패하면 그냥 실패
          localStorage.setItem('wave_login', 'false')
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
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    },
    (error) => {
      Promise.reject(error)
    }
  )
}

export default Axios
