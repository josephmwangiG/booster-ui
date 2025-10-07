import axios from 'axios'

export function useApi() {
  // Use the same base URL configuration as the rest of the app
  const baseURL = axios.defaults.baseURL || import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  
  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  const api = axios.create({
    baseURL,
    headers
  })

  // Request interceptor to add auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor to handle common errors
  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  const get = async (url: string, params?: any) => {
    try {
      const response = await api.get(url, { params })
      return response.data
    } catch (error: any) {
      console.error('GET request failed:', error)
      throw error
    }
  }

  const post = async (url: string, data?: any) => {
    try {
      const response = await api.post(url, data)
      return response.data
    } catch (error: any) {
      console.error('POST request failed:', error)
      throw error
    }
  }

  const put = async (url: string, data?: any) => {
    try {
      const response = await api.put(url, data)
      return response.data
    } catch (error: any) {
      console.error('PUT request failed:', error)
      throw error
    }
  }

  const del = async (url: string) => {
    try {
      const response = await api.delete(url)
      return response.data
    } catch (error: any) {
      console.error('DELETE request failed:', error)
      throw error
    }
  }

  const patch = async (url: string, data?: any) => {
    try {
      const response = await api.patch(url, data)
      return response.data
    } catch (error: any) {
      console.error('PATCH request failed:', error)
      throw error
    }
  }

  return {
    get,
    post,
    put,
    del,
    patch,
    api
  }
}
