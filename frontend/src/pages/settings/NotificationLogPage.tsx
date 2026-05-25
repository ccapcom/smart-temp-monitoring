import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '@/api/services';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import { format } from 'date-fns';

export default function NotificationLogPage() {
  const [page, setPage] = useState(1);

  const { data: logs, isLoading } = useQuery({
    queryKey: ['notification-logs', page],
    queryFn: () => notificationApi.getLogs({ page, limit: 20 }),
  });

  return (
    <div>
      <PageHeader title="Notification Logs" description="Email notification history" />

      <DataTable
        columns={[
          {
            key: 'sentAt',
            header: 'Date',
            render: (row) => format(new Date(row.sentAt), 'dd MMM yyyy HH:mm'),
          },
          {
            key: 'recipients',
            header: 'Recipients',
            render: (row) => <span className="text-xs">{row.recipients?.join(', ')}</span>,
          },
          { key: 'subject', header: 'Subject' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                row.status === 'sent'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {row.status}
              </span>
            ),
          },
          {
            key: 'errorMessage',
            header: 'Error',
            render: (row) => row.errorMessage ? <span className="text-xs text-danger-500">{row.errorMessage}</span> : '-',
          },
        ]}
        data={logs?.data || []}
        page={page}
        totalPages={logs?.totalPages || 1}
        onPageChange={setPage}
        loading={isLoading}
        emptyMessage="No notification logs yet"
      />
    </div>
  );
}
