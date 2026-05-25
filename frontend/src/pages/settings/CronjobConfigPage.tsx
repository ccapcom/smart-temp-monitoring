import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { settingsApi, notificationApi } from '@/api/services';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Play, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import cronstrue from 'cronstrue';
import { format } from 'date-fns';
import type { CronjobConfig } from '@/types';

export default function CronjobConfigPage() {
  const queryClient = useQueryClient();

  const { data: configs, isLoading } = useQuery({
    queryKey: ['cronjob-configs'],
    queryFn: settingsApi.getCronjobs,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CronjobConfig> }) => settingsApi.updateCronjob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cronjob-configs'] });
      toast.success('Cronjob updated');
    },
  });

  const triggerMutation = useMutation({
    mutationFn: notificationApi.trigger,
    onSuccess: () => toast.success('Notification check triggered'),
    onError: () => toast.error('Failed to trigger notification'),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader
        title="Cronjob Configuration"
        description="Schedule automated notification checks"
        actions={
          <button
            onClick={() => triggerMutation.mutate()}
            disabled={triggerMutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {triggerMutation.isPending ? 'Running...' : 'Manual Trigger'}
          </button>
        }
      />

      <div className="space-y-4">
        {configs?.map((config) => (
          <CronjobCard key={config.id} config={config} onUpdate={(data) => updateMutation.mutate({ id: config.id, data })} />
        ))}
        {!configs?.length && (
          <div className="card text-center py-8 text-gray-400">No cronjob configurations found</div>
        )}
      </div>
    </div>
  );
}

function CronjobCard({ config, onUpdate }: { config: CronjobConfig; onUpdate: (data: Partial<CronjobConfig>) => void }) {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      cronExpression: config.cronExpression,
      isEnabled: config.isEnabled,
      description: config.description || '',
    },
  });

  const cronExpr = watch('cronExpression');
  let cronDescription = '';
  try {
    cronDescription = cronstrue.toString(cronExpr);
  } catch {
    cronDescription = 'Invalid cron expression';
  }

  return (
    <form onSubmit={handleSubmit(onUpdate)} className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary-500" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{config.name}</h3>
            <p className="text-xs text-gray-500">{cronDescription}</p>
          </div>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('isEnabled')} className="rounded" />
          <span className="text-sm">Enabled</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Cron Expression</label>
          <input {...register('cronExpression')} className="input-field font-mono" placeholder="0 12 * * *" />
          <p className="text-xs text-gray-400 mt-1">
            Format: minute hour day month weekday
          </p>
        </div>
        <div>
          <label className="label">Description</label>
          <input {...register('description')} className="input-field" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {config.lastRunAt && <span>Last run: {format(new Date(config.lastRunAt), 'dd MMM yyyy HH:mm')}</span>}
        </div>
        <button type="submit" className="btn-primary text-sm">Save Changes</button>
      </div>
    </form>
  );
}
