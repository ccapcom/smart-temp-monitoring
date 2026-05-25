export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string | null;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  departmentId: string | null;
  departmentName?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  category: string;
  emailRecipients: string[];
  emailCc: string[];
  emailBcc: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormTemplate {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: 'ROOM_TEMPERATURE' | 'FRIDGE_TEMPERATURE';
  fields: any;
  version: number;
  isActive: boolean;
}

export interface FormSubmission {
  id: string;
  templateId: string;
  departmentId: string;
  submittedById: string;
  recordDate: string;
  data: any;
  remarks: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  template?: { code: string; name: string; category: string };
  department?: { code: string; name: string };
  submittedBy?: { fullName: string };
  records?: TemperatureRecord[];
}

export interface TemperatureRecord {
  id: string;
  submissionId: string;
  location: string;
  recordDate: string;
  timeSlot: string;
  temperature: number | null;
  humidity: number | null;
  isAbnormal: boolean;
  remarks: string | null;
}

export interface SmtpConfig {
  id: string;
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  useTls: boolean;
  isActive: boolean;
}

export interface CronjobConfig {
  id: string;
  name: string;
  cronExpression: string;
  description: string | null;
  isEnabled: boolean;
  lastRunAt: string | null;
  nextRunAt: string | null;
}

export interface EmailLog {
  id: string;
  departmentId: string | null;
  recipients: string[];
  subject: string;
  body: string;
  status: string;
  errorMessage: string | null;
  sentAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardSummary {
  todaySubmissions: number;
  totalSubmissions30d: number;
  abnormalRecords30d: number;
  recentSubmissions: FormSubmission[];
}

export interface GraphDataPoint {
  id: string;
  date: string;
  timeSlot: string;
  temperature: number | null;
  humidity: number | null;
  location: string;
  isAbnormal: boolean;
  department: string;
  formType: string;
}
