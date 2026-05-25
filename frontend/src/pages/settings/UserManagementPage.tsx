import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, departmentApi } from '@/api/services';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => userApi.list({ page, search: search || undefined }),
  });

  const { data: departments } = useQuery({
    queryKey: ['departments-users'],
    queryFn: () => departmentApi.list({ limit: 200 }),
    select: (d) => d.data,
  });

  const { register, handleSubmit, reset } = useForm();

  const saveMutation = useMutation({
    mutationFn: (data: any) => editing ? userApi.update(editing.id, data) : userApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(editing ? 'User updated' : 'User created');
      setModalOpen(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const openCreate = () => { setEditing(null); reset({ username: '', fullName: '', email: '', role: 'USER', password: '' }); setModalOpen(true); };
  const openEdit = (user: any) => { setEditing(user); reset(user); setModalOpen(true); };

  return (
    <div>
      <PageHeader
        title="User Management"
        actions={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus className="h-4 w-4" /> Add User</button>}
      />

      <div className="card mb-4">
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field" />
      </div>

      <DataTable
        columns={[
          { key: 'username', header: 'Username' },
          { key: 'fullName', header: 'Full Name' },
          { key: 'email', header: 'Email', render: (r) => r.email || '-' },
          { key: 'role', header: 'Role', render: (r) => (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              r.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : r.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}>{r.role}</span>
          )},
          { key: 'department', header: 'Department', render: (r) => r.department?.name || '-' },
          { key: 'isActive', header: 'Status', render: (r) => (
            <span className={`text-xs ${r.isActive ? 'text-green-600' : 'text-gray-400'}`}>{r.isActive ? 'Active' : 'Inactive'}</span>
          )},
          { key: 'actions', header: '', render: (r) => (
            <button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              <Pencil className="h-4 w-4 text-gray-500" />
            </button>
          )},
        ]}
        data={users?.data || []}
        page={page}
        totalPages={users?.totalPages || 1}
        onPageChange={setPage}
        loading={isLoading}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'Create User'}>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <div><label className="label">Username</label><input {...register('username')} className="input-field" disabled={!!editing} /></div>
          {!editing && <div><label className="label">Password</label><input type="password" {...register('password')} className="input-field" /></div>}
          <div><label className="label">Full Name</label><input {...register('fullName')} className="input-field" /></div>
          <div><label className="label">Email</label><input type="email" {...register('email')} className="input-field" /></div>
          <div><label className="label">Role</label>
            <select {...register('role')} className="input-field">
              <option value="USER">User</option><option value="MANAGER">Manager</option><option value="ADMIN">Admin</option>
            </select>
          </div>
          <div><label className="label">Department</label>
            <select {...register('departmentId')} className="input-field">
              <option value="">-- None --</option>
              {departments?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{saveMutation.isPending ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
