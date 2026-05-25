import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formApi } from '@/api/services';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import { Plus, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function FormListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data: templates } = useQuery({
    queryKey: ['form-templates'],
    queryFn: formApi.getTemplates,
  });

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions', page, user?.departmentId],
    queryFn: () =>
      formApi.getSubmissions({
        page,
        limit: 20,
        ...(user?.role !== 'ADMIN' && user?.departmentId ? { departmentId: user.departmentId } : {}),
      }),
  });

  return (
    <div>
      <PageHeader
        title="Digital Form Input"
        description="Submit and manage temperature monitoring forms"
        actions={
          <div className="flex gap-2">
            {templates?.map((t) => (
              <button key={t.id} onClick={() => navigate(`/forms/new/${t.id}`)} className="btn-primary flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t.name}</span>
                <span className="sm:hidden">{t.code}</span>
              </button>
            ))}
          </div>
        }
      />

      <DataTable
        columns={[
          {
            key: 'template',
            header: 'Form',
            render: (row) => (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary-500" />
                <span>{row.template?.name || row.templateId}</span>
              </div>
            ),
          },
          {
            key: 'department',
            header: 'Department',
            render: (row) => row.department?.name || '-',
          },
          {
            key: 'recordDate',
            header: 'Record Date',
            render: (row) => format(new Date(row.recordDate), 'dd MMM yyyy'),
          },
          {
            key: 'submittedBy',
            header: 'Submitted By',
            render: (row) => row.submittedBy?.fullName || '-',
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {row.status}
              </span>
            ),
          },
          {
            key: 'actions',
            header: '',
            render: (row) => (
              <button onClick={() => navigate(`/forms/${row.id}`)} className="text-primary-600 hover:underline text-sm">
                View
              </button>
            ),
          },
        ]}
        data={submissions?.data || []}
        page={page}
        totalPages={submissions?.totalPages || 1}
        onPageChange={setPage}
        loading={isLoading}
        emptyMessage="No submissions yet. Click a button above to create one."
      />
    </div>
  );
}
