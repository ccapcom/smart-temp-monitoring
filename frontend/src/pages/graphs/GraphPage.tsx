import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { graphApi, departmentApi, formApi } from '@/api/services';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/ui/PageHeader';
import TemperatureLineChart from '@/components/charts/TemperatureLineChart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Download } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function GraphPage() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [departmentId, setDepartmentId] = useState(user?.departmentId || '');
  const [templateId, setTemplateId] = useState('');

  const { data: departments } = useQuery({
    queryKey: ['departments-graph'],
    queryFn: () => departmentApi.list({ limit: 200 }),
    select: (d) => d.data,
  });

  const { data: templates } = useQuery({
    queryKey: ['templates-graph'],
    queryFn: formApi.getTemplates,
  });

  const { data: trendData, isLoading } = useQuery({
    queryKey: ['temperature-trend', startDate, endDate, departmentId, templateId],
    queryFn: () =>
      graphApi.getTemperatureTrend({
        startDate,
        endDate,
        ...(departmentId && { departmentId }),
        ...(templateId && { templateId }),
      }),
    enabled: !!startDate && !!endDate,
  });

  const fridgeData = trendData?.filter((d) => d.formType === 'FRIDGE_TEMPERATURE') || [];
  const roomData = trendData?.filter((d) => d.formType === 'ROOM_TEMPERATURE') || [];

  return (
    <div>
      <PageHeader title="Temperature Graphs" description="Visualize temperature trends and anomalies" />

      <div className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">Department</label>
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="input-field">
              <option value="">All Departments</option>
              {departments?.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Form Type</label>
            <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="input-field">
              <option value="">All Types</option>
              {templates?.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {fridgeData.length > 0 && (
            <TemperatureLineChart data={fridgeData} type="fridge" title="Refrigerator Temperature (2-8 °C)" />
          )}
          {roomData.length > 0 && (
            <TemperatureLineChart data={roomData} type="room" title="Room Temperature (15-24 °C)" />
          )}
          {!fridgeData.length && !roomData.length && (
            <div className="card text-center py-12 text-gray-400">
              No temperature data found for the selected filters
            </div>
          )}
        </div>
      )}
    </div>
  );
}
