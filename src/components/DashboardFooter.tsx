import { useLanguage } from '@/src/i18n/LanguageProvider';

export function DashboardFooter() {
  const { copy } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <strong>{copy.footer.product}</strong>
          <span>{copy.footer.tagline}</span>
        </div>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
