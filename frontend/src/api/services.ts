import apiClient from './client';
import type {
  AuthResponse,
  Department,
  FormTemplate,
  FormSubmission,
  SmtpConfig,
  CronjobConfig,
  PaginatedResponse,
  DashboardSummary,
  GraphDataPoint,
  EmailLog,
} from '@/types';

export const authApi = {
  login: (data: { username: string; password: string; departmentId?: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  getProfile: () => apiClient.get('/auth/profile').then((r) => r.data),
};

export const departmentApi = {
  list: (params?: Record<string, any>) =>
    apiClient.get<PaginatedResponse<Department>>('/departments', { params }).then((r) => r.data),
  get: (id: string) => apiClient.get<Department>(`/departments/${id}`).then((r) => r.data),
  create: (data: Partial<Department>) => apiClient.post<Department>('/departments', data).then((r) => r.data),
  update: (id: string, data: Partial<Department>) =>
    apiClient.put<Department>(`/departments/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/departments/${id}`).then((r) => r.data),
  categories: () => apiClient.get<string[]>('/departments/categories').then((r) => r.data),
};

export const formApi = {
  getTemplates: () => apiClient.get<FormTemplate[]>('/forms/templates').then((r) => r.data),
  getTemplate: (id: string) => apiClient.get<FormTemplate>(`/forms/templates/${id}`).then((r) => r.data),
  submit: (data: any) => apiClient.post<FormSubmission>('/forms/submissions', data).then((r) => r.data),
  getSubmissions: (params?: Record<string, any>) =>
    apiClient.get<PaginatedResponse<FormSubmission>>('/forms/submissions', { params }).then((r) => r.data),
  getSubmission: (id: string) => apiClient.get<FormSubmission>(`/forms/submissions/${id}`).then((r) => r.data),
  updateSubmission: (id: string, data: any) =>
    apiClient.put<FormSubmission>(`/forms/submissions/${id}`, data).then((r) => r.data),
  getSubmissionStatus: (date?: string) =>
    apiClient.get('/forms/submission-status', { params: { date } }).then((r) => r.data),
};

export const graphApi = {
  getTemperatureTrend: (params: Record<string, any>) =>
    apiClient.get<GraphDataPoint[]>('/graphs/temperature-trend', { params }).then((r) => r.data),
  getDashboard: (departmentId?: string) =>
    apiClient.get<DashboardSummary>('/graphs/dashboard', { params: { departmentId } }).then((r) => r.data),
  getLocations: (departmentId?: string) =>
    apiClient.get<string[]>('/graphs/locations', { params: { departmentId } }).then((r) => r.data),
};

export const notificationApi = {
  testConnection: () => apiClient.post('/notifications/test-connection').then((r) => r.data),
  trigger: () => apiClient.post('/notifications/trigger').then((r) => r.data),
  getLogs: (params?: Record<string, any>) =>
    apiClient.get<PaginatedResponse<EmailLog>>('/notifications/logs', { params }).then((r) => r.data),
};

export const settingsApi = {
  getSmtp: () => apiClient.get<SmtpConfig>('/settings/smtp').then((r) => r.data),
  updateSmtp: (id: string, data: Partial<SmtpConfig>) =>
    apiClient.put<SmtpConfig>(`/settings/smtp/${id}`, data).then((r) => r.data),
  getCronjobs: () => apiClient.get<CronjobConfig[]>('/settings/cronjobs').then((r) => r.data),
  updateCronjob: (id: string, data: Partial<CronjobConfig>) =>
    apiClient.put<CronjobConfig>(`/settings/cronjobs/${id}`, data).then((r) => r.data),
  getAuditLogs: (params?: Record<string, any>) =>
    apiClient.get('/settings/audit-logs', { params }).then((r) => r.data),
};

export const userApi = {
  list: (params?: Record<string, any>) =>
    apiClient.get('/users', { params }).then((r) => r.data),
  get: (id: string) => apiClient.get(`/users/${id}`).then((r) => r.data),
  create: (data: any) => apiClient.post('/users', data).then((r) => r.data),
  update: (id: string, data: any) => apiClient.put(`/users/${id}`, data).then((r) => r.data),
  resetPassword: (id: string, password: string) =>
    apiClient.put(`/users/${id}/reset-password`, { password }).then((r) => r.data),
};
