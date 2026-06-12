import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/profile'),
}

export const partsAPI = {
  getAll: (params) => API.get('/parts', { params }),
  getById: (id) => API.get(`/parts/${id}`),
  create: (data) => API.post('/parts', data),
  update: (id, data) => API.put(`/parts/${id}`, data),
  delete: (id) => API.delete(`/parts/${id}`),
}

export const stockAPI = {
  getAll: (params) => API.get('/stock', { params }),
  getById: (id) => API.get(`/stock/${id}`),
  create: (data) => API.post('/stock', data),
  delete: (id) => API.delete(`/stock/${id}`),
}

export const jumpsAPI = {
  getAll: (params) => API.get('/jumps', { params }),
  getById: (id) => API.get(`/jumps/${id}`),
  create: (data) => API.post('/jumps', data),
  updateStatus: (id, status) => API.put(`/jumps/${id}/status`, { status }),
  delete: (id) => API.delete(`/jumps/${id}`),
}

export default API
