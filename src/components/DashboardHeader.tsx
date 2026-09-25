import { Globe2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { LanguageSwitcher } from '@/src/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/src/components/ThemeSwitcher';
import { useLanguage } from '@/src/i18n/LanguageProvider';

function formatUtcClock(value: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(value);
}

export function DashboardHeader() {
  const { copy, formatLocale } = useLanguage();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="topbar">
      <a className="brand" href="#dashboard" aria-label="Stream Board dashboard">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="brand-wordmark">
          stream<span className="brand-slash">/</span>board<small>Dashboard</small>
        </span>
      </a>
      <div className="topbar__center">
        <span className="environment-chip"><Globe2 size={14} aria-hidden="true" /> {copy.navigation.environment}</span>
        <span className="topbar__separator" aria-hidden="true" />
        <time className="topbar__clock" dateTime={now ? now.toISOString() : undefined}>
          {now ? `${formatUtcClock(now, formatLocale)} ${copy.navigation.utc}` : copy.navigation.utc}
        </time>
      </div>
      <div className="topbar__right">
        <ThemeSwitcher />
        <LanguageSwitcher />
        <span className="profile-initials" aria-label={copy.navigation.profile}>Ops</span>
      </div>
    </header>
  );
}
