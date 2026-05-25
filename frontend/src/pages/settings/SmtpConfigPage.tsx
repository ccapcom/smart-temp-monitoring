import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { settingsApi, notificationApi } from '@/api/services';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import type { SmtpConfig } from '@/types';

export default function SmtpConfigPage() {
  const queryClient = useQueryClient();
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { data: config, isLoading } = useQuery({
    queryKey: ['smtp-config'],
    queryFn: settingsApi.getSmtp,
  });

  const { register, handleSubmit } = useForm<Partial<SmtpConfig>>({
    values: config || undefined,
  });

  const saveMutation = useMutation({
    mutationFn: (data: Partial<SmtpConfig>) => settingsApi.updateSmtp(config!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smtp-config'] });
      toast.success('SMTP configuration updated');
    },
    onError: () => toast.error('Failed to update SMTP configuration'),
  });

  const testMutation = useMutation({
    mutationFn: notificationApi.testConnection,
    onSuccess: (result) => {
      setTestResult(result);
      if (result.success) toast.success('Connection successful');
      else toast.error(`Connection failed: ${result.message}`);
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="SMTP Configuration" description="Configure mail server settings for email notifications" />

      <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="card space-y-5 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">SMTP Host</label>
            <input {...register('host')} className="input-field" placeholder="smtp.gmail.com" />
          </div>
          <div>
            <label className="label">Port</label>
            <input type="number" {...register('port', { valueAsNumber: true })} className="input-field" placeholder="587" />
          </div>
          <div>
            <label className="label">Username</label>
            <input {...register('username')} className="input-field" autoComplete="off" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" {...register('password')} className="input-field" autoComplete="new-password" />
          </div>
          <div>
            <label className="label">Sender Email</label>
            <input type="email" {...register('fromEmail')} className="input-field" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('useTls')} className="rounded" />
              <span className="text-sm">Enable TLS/SSL</span>
            </label>
          </div>
        </div>

        {testResult && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {testResult.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span className="text-sm">{testResult.message}</span>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => testMutation.mutate()}
            disabled={testMutation.isPending}
            className="btn-secondary flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {testMutation.isPending ? 'Testing...' : 'Test Connection'}
          </button>
          <button type="submit" className="btn-primary" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
