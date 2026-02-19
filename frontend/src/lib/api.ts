import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  forgotPassword: (data: any) => api.post('/auth/forgot-password', data),
};

export const ideaAPI = {
  getIdeas: (params?: any) => api.get('/ideas', { params }),
  getIdeaById: (id: string) => api.get(`/ideas/${id}`),
  createIdea: (data: any) => api.post('/ideas', data),
  updateIdea: (id: string, data: any) => api.put(`/ideas/${id}`, data),
  deleteIdea: (id: string) => api.delete(`/ideas/${id}`),
  getMyIdeas: (params?: any) => api.get('/ideas/my-ideas', { params }),
  
  // Feedback endpoints
  getFeedback: (ideaId: string, params?: any) => 
    api.get(`/ideas/${ideaId}/feedback`, { params }),
  createFeedback: (ideaId: string, data: any) => 
    api.post(`/ideas/${ideaId}/feedback`, data),
  updateFeedback: (id: string, data: any) => 
    api.put(`/ideas/feedback/${id}`, data),
  deleteFeedback: (id: string) => 
    api.delete(`/ideas/feedback/${id}`),
};

export const connectionAPI = {
  getConnections: (params?: any) => api.get('/connections', { params }),
  createConnection: (data: any) => api.post('/connections', data),
  updateConnection: (id: string, data: any) => api.put(`/connections/${id}`, data),
  deleteConnection: (id: string) => api.delete(`/connections/${id}`),
  getUsers: (params?: any) => api.get('/connections/users', { params }),
};

export const resourceAPI = {
  getResources: (params?: any) => api.get('/resources', { params }),
  getResourceById: (id: string) => api.get(`/resources/${id}`),
  createResource: (data: FormData) => api.post('/resources', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateResource: (id: string, data: FormData) => api.put(`/resources/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteResource: (id: string) => api.delete(`/resources/${id}`),
  downloadResource: (id: string) => api.get(`/resources/${id}/download`),
  getMyResources: (params?: any) => api.get('/resources/my-resources', { params }),
};

export const bookingAPI = {
  getBookings: (params?: any) => api.get('/bookings', { params }),
  createBooking: (data: any) => api.post('/bookings', data),
  updateBooking: (id: string, data: any) => api.put(`/bookings/${id}`, data),
  getMentorSlots: (mentorId: string, params?: any) => 
    api.get(`/bookings/mentors/${mentorId}/slots`, { params }),
};

export const pitchAPI = {
  getPitches: (params?: any) => api.get('/pitches', { params }),
  getPitchById: (id: string) => api.get(`/pitches/${id}`),
  createPitch: (data: FormData) => api.post('/pitches', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updatePitch: (id: string, data: FormData) => api.put(`/pitches/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deletePitch: (id: string) => api.delete(`/pitches/${id}`),
  getMyPitches: (params?: any) => api.get('/pitches/my-pitches', { params }),
};

export const notificationAPI = {
  getNotifications: (params?: any) => api.get('/notifications', { params }),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
};

export default api;