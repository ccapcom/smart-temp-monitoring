import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { formApi, departmentApi } from '@/api/services';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/ui/PageHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function FormInputPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { data: template, isLoading } = useQuery({
    queryKey: ['template', templateId],
    queryFn: () => formApi.getTemplate(templateId!),
    enabled: !!templateId,
  });

  const { data: departments } = useQuery({
    queryKey: ['departments-form'],
    queryFn: () => departmentApi.list({ limit: 200 }),
    select: (d) => d.data,
    enabled: user?.role === 'ADMIN',
  });

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      recordDate: new Date().toISOString().split('T')[0],
      departmentId: user?.departmentId || '',
      remarks: '',
      data: {} as Record<string, any>,
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (!template) return <div className="text-center py-12">Template not found</div>;

  const isRoomTemp = template.category === 'ROOM_TEMPERATURE';
  const isFridgeTemp = template.category === 'FRIDGE_TEMPERATURE';

  const onSubmit = async (formValues: any) => {
    setSubmitting(true);
    try {
      const temperatureRecords: any[] = [];

      if (isRoomTemp && template.fields?.sections) {
        for (const section of template.fields.sections) {
          const sectionData = formValues.data?.[section.key];
          if (sectionData) {
            temperatureRecords.push({
              location: section.label,
              recordDate: formValues.recordDate,
              timeSlot: formValues.data?.time || '08:00',
              temperature: sectionData.temperature,
              humidity: sectionData.humidity,
              isAbnormal:
                sectionData.temperature < template.fields.metadata.normalTempRange.min ||
                sectionData.temperature > template.fields.metadata.normalTempRange.max ||
                sectionData.humidity < template.fields.metadata.normalHumidityRange.min ||
                sectionData.humidity > template.fields.metadata.normalHumidityRange.max,
            });
          }
        }
      }

      if (isFridgeTemp) {
        for (let day = 1; day <= 31; day++) {
          for (const slot of template.fields.timeSlots) {
            const val = formValues.data?.[`day_${day}_${slot.replace(':', '')}`];
            if (val !== undefined && val !== '') {
              const temp = parseFloat(val);
              temperatureRecords.push({
                location: 'Refrigerator',
                recordDate: formValues.recordDate,
                timeSlot: slot,
                temperature: temp,
                isAbnormal: temp < template.fields.temperatureRange.min || temp > template.fields.temperatureRange.max,
              });
            }
          }
        }
      }

      await formApi.submit({
        templateId: template.id,
        departmentId: formValues.departmentId || user?.departmentId,
        recordDate: formValues.recordDate,
        formData: formValues.data,
        temperatureRecords,
        remarks: formValues.remarks,
      });

      toast.success('Form submitted successfully');
      navigate('/forms');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title={template.name} description={template.description || undefined} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Record Date</label>
              <input type="date" {...register('recordDate')} className="input-field" />
            </div>
            {user?.role === 'ADMIN' && (
              <div>
                <label className="label">Department</label>
                <select {...register('departmentId')} className="input-field">
                  <option value="">-- Select --</option>
                  {departments?.map((d) => (
                    <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                  ))}
                </select>
              </div>
            )}
            {isRoomTemp && (
              <div>
                <label className="label">Check Time</label>
                <input type="time" {...register('data.time')} className="input-field" defaultValue="08:00" />
              </div>
            )}
          </div>
        </div>

        {isRoomTemp && template.fields?.sections && (
          <div className="space-y-4">
            {template.fields.sections.map((section: any) => (
              <div key={section.key} className="card">
                <h3 className="text-md font-semibold mb-3 text-gray-900 dark:text-white">
                  {section.label}
                  {section.labelTh && (
                    <span className="text-sm font-normal text-gray-500 ml-2">({section.labelTh})</span>
                  )}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.fields.map((field: any) => (
                    <div key={field.key}>
                      <label className="label">{field.label}</label>
                      <input
                        type="number"
                        step="0.1"
                        min={field.min}
                        max={field.max}
                        {...register(`data.${section.key}.${field.key}`)}
                        className="input-field"
                        placeholder={`${field.min || 0} - ${field.max || 100}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {isFridgeTemp && (
          <div className="card overflow-x-auto">
            <h3 className="text-md font-semibold mb-3 text-gray-900 dark:text-white">
              Daily Temperature Readings (2-8 °C)
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="table-header w-16">Day</th>
                  {template.fields.timeSlots.map((slot: string) => (
                    <th key={slot} className="table-header text-center">{slot}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <tr key={day}>
                    <td className="table-cell font-medium">{day}</td>
                    {template.fields.timeSlots.map((slot: string) => (
                      <td key={slot} className="table-cell">
                        <input
                          type="number"
                          step="0.1"
                          min={0}
                          max={15}
                          {...register(`data.day_${day}_${slot.replace(':', '')}`)}
                          className="input-field w-20 text-center"
                          placeholder="-"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="card">
          <label className="label">Remarks</label>
          <textarea
            {...register('remarks')}
            className="input-field"
            rows={3}
            placeholder="Additional notes or observations..."
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate('/forms')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  );
}
