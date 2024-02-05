import axios, { AxiosError } from "axios"

export interface IFieldError {
  fieldName: string,
  message: string
}

export interface IError {
  detail: string,
  error: string,
  status: number,
  fieldErrors?: IFieldError[],
  timestamp: number|string|Date,
}

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // baseURL: 'http://localhost:8080/api/',
  // baseURL: ['localhost', '127.0.0.1'].includes(window.location.hostname) ? import.meta.env.VITE_BASE_URL : `http://${window.location.host}/api`,
  headers: {
    "Content-Type": "application/json"
  }
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("@access-token") || ""
  if(config.headers && token) config.headers["Authorization"] = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => response,
  async(error: AxiosError) => {
    if(error.response?.status === 401) {
      localStorage.removeItem("@access-token")
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default http
