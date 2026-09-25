import { MoonStar } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Select';
import { useLanguage } from '@/src/i18n/LanguageProvider';
import { useTheme, type AppTheme } from '@/src/providers/ThemeProvider';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { copy } = useLanguage();

  return (
    <div className="theme-switcher">
      <MoonStar size={15} aria-hidden="true" />
      <Select value={theme} onValueChange={(value) => setTheme(value as AppTheme)}>
        <SelectTrigger className="theme-select" aria-label={copy.theme.label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="dashboard-select__content">
          <SelectItem value="midnight">{copy.theme.midnight}</SelectItem>
          <SelectItem value="daylight">{copy.theme.daylight}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
