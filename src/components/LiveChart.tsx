import { Activity, ChartNoAxesCombined } from 'lucide-react';
import { memo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatDuration } from '@/src/utils/helpers';

export interface ChartPoint {
  label: string;
  latency: number;
}

interface LiveChartProps {
  points: ChartPoint[];
  averageLatency: number;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value;
  return (
    <div className="chart-tooltip">
      <span>{label}</span>
      <strong>{typeof value === 'number' ? formatDuration(value) : '—'}</strong>
    </div>
  );
}

export const LiveChart = memo(function LiveChart({ points, averageLatency }: LiveChartProps) {
  return (
    <section className="panel chart-panel" aria-labelledby="latency-heading">
      <div className="panel-heading">
        <div>
          <p className="eyebrow"><Activity size={14} aria-hidden="true" /> Live metric</p>
          <h2 id="latency-heading">Latency pulse</h2>
          <p>Request settlement time across the selected stream.</p>
        </div>
        <div className="chart-summary">
          <ChartNoAxesCombined size={16} aria-hidden="true" />
          <span>Avg</span>
          <strong>{averageLatency || 0} ms</strong>
        </div>
      </div>

      <div className="chart-wrap">
        {points.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 10, right: 5, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6c7cff" stopOpacity={0.34} />
                  <stop offset="100%" stopColor="#6c7cff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#263048" strokeDasharray="2 6" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8290ab', fontSize: 11 }}
                minTickGap={40}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8290ab', fontSize: 11 }}
                width={38}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#45526e', strokeDasharray: '3 4' }} />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="#8291ff"
                strokeWidth={2.25}
                fill="url(#latencyFill)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">Waiting for validated events</div>
        )}
      </div>
    </section>
  );
});
