import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Building2,
  Settings,
  Mail,
  Clock,
  Server,
  Users,
  X,
  Thermometer,
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'MANAGER', 'USER'] },
  { to: '/forms', icon: FileText, label: 'Form Input', roles: ['ADMIN', 'MANAGER', 'USER'] },
  { to: '/graphs', icon: BarChart3, label: 'Graphs', roles: ['ADMIN', 'MANAGER', 'USER'] },
  { to: '/departments', icon: Building2, label: 'Departments', roles: ['ADMIN'] },
  { to: '/users', icon: Users, label: 'Users', roles: ['ADMIN'] },
  { to: '/settings/email', icon: Mail, label: 'Email Config', roles: ['ADMIN'] },
  { to: '/settings/smtp', icon: Server, label: 'SMTP Config', roles: ['ADMIN'] },
  { to: '/settings/cronjob', icon: Clock, label: 'Cronjob Config', roles: ['ADMIN'] },
  { to: '/settings/notifications', icon: Mail, label: 'Notification Logs', roles: ['ADMIN'] },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const filteredItems = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Thermometer className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">SmartTemp</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {filteredItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50',
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
