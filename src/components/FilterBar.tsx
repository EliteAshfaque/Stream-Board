import { Clock3, SlidersHorizontal } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Select';
import { SERVICES } from '@/src/types/event';
import { useLanguage } from '@/src/i18n/LanguageProvider';
import type { ServiceFilter, TimeWindow } from '@/src/types/event';

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
  const { copy } = useLanguage();
  return (
    <div className="filter-bar" aria-label="Dashboard filters">
      <span className="filter-bar__label">
        <SlidersHorizontal size={15} aria-hidden="true" />
        {copy.filters.label}
      </span>
      <div className="select-field">
        <span className="sr-only">{copy.filters.service}</span>
        <Select value={service} onValueChange={(value) => onServiceChange(value as ServiceFilter)}>
          <SelectTrigger className="dashboard-select" aria-label={copy.filters.service}>
            <SelectValue placeholder={copy.filters.allServices} />
          </SelectTrigger>
          <SelectContent className="dashboard-select__content">
            <SelectItem value="all">{copy.filters.allServices}</SelectItem>
            {SERVICES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="select-field">
        <span className="sr-only">{copy.filters.timeWindow}</span>
        <Clock3 size={15} aria-hidden="true" />
        <Select
          value={String(timeWindow)}
          onValueChange={(value) => onTimeWindowChange(Number(value) as TimeWindow)}
        >
          <SelectTrigger className="dashboard-select" aria-label={copy.filters.timeWindow}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dashboard-select__content">
            <SelectItem value="1">{copy.filters.lastMinute}</SelectItem>
            <SelectItem value="5">{copy.filters.lastFiveMinutes}</SelectItem>
            <SelectItem value="15">{copy.filters.lastFifteenMinutes}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
