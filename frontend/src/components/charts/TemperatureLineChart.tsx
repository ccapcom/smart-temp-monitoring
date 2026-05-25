import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { chartColors, temperatureThresholds } from '@/theme/colors';

interface TemperatureLineChartProps {
  data: Array<{ date: string; timeSlot: string; temperature: number | null; location: string }>;
  type: 'room' | 'fridge';
  title?: string;
  showHumidity?: boolean;
}

export default function TemperatureLineChart({ data, type, title }: TemperatureLineChartProps) {
  const thresholds = type === 'fridge' ? temperatureThresholds.fridge : temperatureThresholds.room;

  const chartData = data.map((d) => ({
    name: `${new Date(d.date).getDate()}/${d.timeSlot}`,
    temperature: d.temperature,
    location: d.location,
  }));

  return (
    <div className="card">
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
          <YAxis
            domain={[thresholds.min - 2, thresholds.max + 2]}
            tick={{ fontSize: 11 }}
            stroke="#9CA3AF"
            label={{ value: thresholds.unit, position: 'insideLeft', offset: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: 'none',
              borderRadius: '8px',
              color: '#F3F4F6',
              fontSize: '12px',
            }}
          />
          <Legend />
          <ReferenceLine
            y={thresholds.max}
            stroke={chartColors.danger}
            strokeDasharray="5 5"
            label={{ value: `Max ${thresholds.max}${thresholds.unit}`, fill: chartColors.danger, fontSize: 11 }}
          />
          <ReferenceLine
            y={thresholds.min}
            stroke={chartColors.warning}
            strokeDasharray="5 5"
            label={{ value: `Min ${thresholds.min}${thresholds.unit}`, fill: chartColors.warning, fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke={chartColors.primary}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Temperature"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
