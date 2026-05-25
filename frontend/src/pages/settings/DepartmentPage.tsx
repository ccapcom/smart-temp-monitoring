import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentApi } from '@/api/services';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Department } from '@/types';

export default function DepartmentPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments', page, search, category],
    queryFn: () => departmentApi.list({ page, search: search || undefined, category: category || undefined }),
  });

  const { data: categories } = useQuery({
    queryKey: ['dept-categories'],
    queryFn: departmentApi.categories,
  });

  const { register, handleSubmit, reset, setValue } = useForm<Partial<Department>>();

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Department>) =>
      editing ? departmentApi.update(editing.id, data) : departmentApi.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success(editing ? 'Department updated' : 'Department created');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to save'),
  });

  const deleteMutation = useMutation({
    mutationFn: departmentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted');
    },
  });

  const openCreate = () => {
    setEditing(null);
    reset({ code: '', name: '', category: 'OPD', emailRecipients: [], emailCc: [], emailBcc: [], isActive: true });
    setModalOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditing(dept);
    reset(dept);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    reset();
  };

  return (
    <div>
      <PageHeader
        title="Department Email Configuration"
        description="Manage department notification settings"
        actions={
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Department
          </button>
        }
      />

      <div className="card mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field flex-1"
          />
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="input-field w-auto">
            <option value="">All Categories</option>
            {categories?.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'code', header: 'Code' },
          { key: 'name', header: 'Name' },
          { key: 'category', header: 'Category' },
          {
            key: 'emailRecipients',
            header: 'Recipients',
            render: (row) => (
              <span className="text-xs">{row.emailRecipients?.length ? row.emailRecipients.join(', ') : '-'}</span>
            ),
          },
          {
            key: 'isActive',
            header: 'Status',
            render: (row) => (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                row.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {row.isActive ? 'Active' : 'Inactive'}
              </span>
            ),
          },
          {
            key: 'actions',
            header: '',
            render: (row) => (
              <div className="flex gap-1">
                <button onClick={() => openEdit(row)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Pencil className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={() => { if (confirm('Delete this department?')) deleteMutation.mutate(row.id); }}
                  className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 text-danger-500" />
                </button>
              </div>
            ),
          },
        ]}
        data={departments?.data || []}
        page={page}
        totalPages={departments?.totalPages || 1}
        onPageChange={setPage}
        loading={isLoading}
      />

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Edit Department' : 'Add Department'} size="lg">
        <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Code</label>
              <input {...register('code')} className="input-field" disabled={!!editing} />
            </div>
            <div>
              <label className="label">Name</label>
              <input {...register('name')} className="input-field" />
            </div>
            <div>
              <label className="label">Category</label>
              <select {...register('category')} className="input-field">
                <option value="OPD">OPD</option>
                <option value="IPD">IPD</option>
                <option value="OR">OR</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('isActive')} className="rounded" />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>
          <div>
            <label className="label">Email Recipients (comma separated)</label>
            <input
              {...register('emailRecipients', {
                setValueAs: (v: any) => (typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v),
              })}
              className="input-field"
              placeholder="email1@example.com, email2@example.com"
              defaultValue={editing?.emailRecipients?.join(', ')}
            />
          </div>
          <div>
            <label className="label">CC (comma separated)</label>
            <input
              {...register('emailCc', {
                setValueAs: (v: any) => (typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v),
              })}
              className="input-field"
              defaultValue={editing?.emailCc?.join(', ')}
            />
          </div>
          <div>
            <label className="label">BCC (comma separated)</label>
            <input
              {...register('emailBcc', {
                setValueAs: (v: any) => (typeof v === 'string' ? v.split(',').map((s: string) => s.trim()).filter(Boolean) : v),
              })}
              className="input-field"
              defaultValue={editing?.emailBcc?.join(', ')}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
