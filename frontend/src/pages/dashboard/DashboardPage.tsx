import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { graphApi, formApi } from '@/api/services';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FileText, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: summary, isLoading } = useQuery({
    queryKey: ['dashboard', user?.departmentId],
    queryFn: () => graphApi.getDashboard(user?.departmentId || undefined),
  });

  const { data: submissionStatus } = useQuery({
    queryKey: ['submission-status', new Date().toISOString().split('T')[0]],
    queryFn: () => formApi.getSubmissionStatus(new Date().toISOString()),
    enabled: user?.role === 'ADMIN',
  });

  if (isLoading) return <LoadingSpinner />;

  const submitted = submissionStatus?.filter((d: any) => d.hasSubmitted).length || 0;
  const total = submissionStatus?.length || 0;

  return (
    <div>
      <PageHeader title="Dashboard" description={`Welcome back, ${user?.fullName}`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Today's Submissions" value={summary?.todaySubmissions || 0} icon={FileText} color="blue" />
        <StatCard title="30-Day Submissions" value={summary?.totalSubmissions30d || 0} icon={BarChart3} color="green" />
        <StatCard title="Abnormal Records (30d)" value={summary?.abnormalRecords30d || 0} icon={AlertTriangle} color="red" />
        {user?.role === 'ADMIN' && (
          <StatCard title="Dept. Submitted Today" value={`${submitted}/${total}`} icon={CheckCircle} color="yellow" />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Submissions</h3>
          <div className="space-y-3">
            {summary?.recentSubmissions?.length ? (
              summary.recentSubmissions.map((sub: any) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {sub.template?.name || sub.templateId}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {sub.department?.name} &middot; {sub.submittedBy?.fullName}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(sub.createdAt), 'dd MMM yyyy HH:mm')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No recent submissions</p>
            )}
          </div>
        </div>

        {user?.role === 'ADMIN' && submissionStatus && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Department Status Today
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {submissionStatus.map((dept: any) => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{dept.name}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      dept.hasSubmitted
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {dept.hasSubmitted ? 'Submitted' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
