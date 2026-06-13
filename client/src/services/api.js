import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Safely extracts array from any API response shape:
// { data: { data: [...] } }  →  res.data.data
// { data: [...] }            →  res.data
// anything else              →  []
export const extractArray = (res) => {
  const d = res?.data
  if (Array.isArray(d?.data)) return d.data
  if (Array.isArray(d)) return d
  return []
}

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/profile'),
}

export const bikesAPI = {
  getAll: () => API.get('/bikes'),
  create: (data) => API.post('/bikes', data),
  update: (id, data) => API.put(`/bikes/${id}`, data),
  delete: (id) => API.delete(`/bikes/${id}`),
}

export const rawMaterialsAPI = {
  getAll: (params) => API.get('/raw-materials', { params }),
  create: (data) => API.post('/raw-materials', data),
  update: (id, data) => API.put(`/raw-materials/${id}`, data),
  delete: (id) => API.delete(`/raw-materials/${id}`),
  adjustStock: (id, data) => API.put(`/raw-materials/${id}/stock`, data),
}

export const assemblesAPI = {
  getAll: (params) => API.get('/assembles', { params }),
  create: (data) => API.post('/assembles', data),
  update: (id, data) => API.put(`/assembles/${id}`, data),
  delete: (id) => API.delete(`/assembles/${id}`),
}

export const salesAPI = {
  getAll: (params) => API.get('/sales', { params }),
  create: (data) => API.post('/sales', data),
}

export default API
