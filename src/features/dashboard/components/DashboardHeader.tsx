import { Globe2 } from 'lucide-react';

import { LanguageSwitcher } from '@/src/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/src/components/ThemeSwitcher';
import { useLanguage } from '@/src/i18n/LanguageProvider';

export function DashboardHeader() {
  const { copy } = useLanguage();

  return (
    <header className="topbar">
      <a className="brand" href="#dashboard" aria-label="Pulse Monitor dashboard">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="brand-wordmark">
          pulse<span className="brand-slash">/</span>monitor<small>CONTROL ROOM</small>
        </span>
      </a>
      <div className="topbar__center">
        <span className="environment-chip"><Globe2 size={14} aria-hidden="true" /> {copy.navigation.production}</span>
        <span className="topbar__separator" aria-hidden="true" />
        <span className="topbar__clock">{copy.navigation.liveClock}</span>
      </div>
      <div className="topbar__right">
        <ThemeSwitcher />
        <LanguageSwitcher />
        <span className="profile-initials" aria-label={copy.navigation.profile}>OA</span>
      </div>
    </header>
  );
}
