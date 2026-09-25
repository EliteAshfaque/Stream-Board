import { Languages } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Select';
import { useLanguage } from '@/src/i18n/LanguageProvider';
import type { Language } from '@/src/i18n/translations';

export function LanguageSwitcher() {
  const { language, setLanguage, copy } = useLanguage();

  return (
    <div className="language-switcher">
      <Languages size={15} aria-hidden="true" />
      <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger className="language-select" aria-label={copy.language.label}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="dashboard-select__content">
          <SelectItem value="en">{copy.language.english}</SelectItem>
          <SelectItem value="fr">{copy.language.french}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
