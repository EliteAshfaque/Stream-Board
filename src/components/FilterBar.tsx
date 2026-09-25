import { Clock3, SlidersHorizontal } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SERVICES, type ServiceName } from '@/src/types/event';

export type ServiceFilter = ServiceName | 'all';
export type TimeWindow = 1 | 5 | 15;

interface FilterBarProps {
  service: ServiceFilter;
  timeWindow: TimeWindow;
  onServiceChange: (value: ServiceFilter) => void;
  onTimeWindowChange: (value: TimeWindow) => void;
}

export function FilterBar({
  service,
  timeWindow,
  onServiceChange,
  onTimeWindowChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar" aria-label="Dashboard filters">
      <span className="filter-bar__label">
        <SlidersHorizontal size={15} aria-hidden="true" />
        Scope
      </span>
      <div className="select-field">
        <span className="sr-only">Service</span>
        <Select value={service} onValueChange={(value) => onServiceChange(value as ServiceFilter)}>
          <SelectTrigger className="dashboard-select" aria-label="Service filter">
            <SelectValue placeholder="All services" />
          </SelectTrigger>
          <SelectContent className="dashboard-select__content">
            <SelectItem value="all">All services</SelectItem>
            {SERVICES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="select-field">
        <span className="sr-only">Time window</span>
        <Clock3 size={15} aria-hidden="true" />
        <Select
          value={String(timeWindow)}
          onValueChange={(value) => onTimeWindowChange(Number(value) as TimeWindow)}
        >
          <SelectTrigger className="dashboard-select" aria-label="Time window">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dashboard-select__content">
            <SelectItem value="1">Last minute</SelectItem>
            <SelectItem value="5">Last 5 minutes</SelectItem>
            <SelectItem value="15">Last 15 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
