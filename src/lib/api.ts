import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

export const importsService = {
  list: (params: any) => api.get('/imports', { params }).then((res) => res.data),
  get: (id: string) => api.get(`/imports/${id}`).then((res) => res.data),
  errors: (id: string, params: any) => api.get(`/imports/${id}/errors`, { params }).then((res) => res.data),
  logs: (id: string, params: any) => api.get(`/imports/${id}/logs`, { params }).then((res) => res.data),
  retry: (id: string) => api.post(`/imports/${id}/retry`).then((res) => res.data),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/imports', formData).then((res) => res.data);
  },
  preview: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/imports/preview', formData).then((res) => res.data);
  },
};
