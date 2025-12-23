import api from '../utils/api'

export const login = async (username, password) => {
  const response = await api.post('/api/v1/auth/login', { username, password })
  return response.data
}

export const register = async (userData) => {
  const response = await api.post('/api/v1/auth/register', userData)
  return response.data
}

export const logout = async () => {
  const response = await api.post('/api/v1/auth/logout')
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/api/v1/auth/me')
  return response.data
}
