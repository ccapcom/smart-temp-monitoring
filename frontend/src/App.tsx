import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import FormListPage from '@/pages/forms/FormListPage';
import FormInputPage from '@/pages/forms/FormInputPage';
import GraphPage from '@/pages/graphs/GraphPage';
import DepartmentPage from '@/pages/settings/DepartmentPage';
import UserManagementPage from '@/pages/settings/UserManagementPage';
import SmtpConfigPage from '@/pages/settings/SmtpConfigPage';
import CronjobConfigPage from '@/pages/settings/CronjobConfigPage';
import NotificationLogPage from '@/pages/settings/NotificationLogPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="forms" element={<FormListPage />} />
        <Route path="forms/new/:templateId" element={<FormInputPage />} />
        <Route path="forms/:id" element={<FormInputPage />} />
        <Route path="graphs" element={<GraphPage />} />
        <Route path="departments" element={<DepartmentPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="settings/email" element={<DepartmentPage />} />
        <Route path="settings/smtp" element={<SmtpConfigPage />} />
        <Route path="settings/cronjob" element={<CronjobConfigPage />} />
        <Route path="settings/notifications" element={<NotificationLogPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
