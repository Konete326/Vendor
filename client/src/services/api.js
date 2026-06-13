import axios from 'axios'

let apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

if (apiURL) {
  // If it is a domain name and protocol is missing, prepend https://
  if (!apiURL.startsWith('http://') && !apiURL.startsWith('https://') && apiURL.includes('.')) {
    apiURL = `https://${apiURL}`;
  }
  // Ensure the URL ends with /api (without appending it twice)
  if (!apiURL.endsWith('/api') && !apiURL.endsWith('/api/')) {
    apiURL = apiURL.endsWith('/') ? `${apiURL}api` : `${apiURL}/api`;
  }
}

const API = axios.create({
  baseURL: apiURL,
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
