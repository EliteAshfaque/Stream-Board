interface LoadingProps {
  label: string;
  hint?: string;
}

export function Loading({ label, hint }: LoadingProps) {
  return (
    <div className="loader" role="status" aria-live="polite" aria-busy="true">
      <div className="loader__hero">
        <span className="loader__glow" aria-hidden="true" />
        <div className="loader__orb" aria-hidden="true">
          <span className="loader__ring" />
          <span className="loader__brand">
            <i /><i /><i /><i />
          </span>
        </div>
        <p className="loader__title">{label}</p>
        {hint ? <p className="loader__hint">{hint}</p> : null}
        <div className="loader__track" aria-hidden="true">
          <span />
        </div>
      </div>

      <div className="loader__grid" aria-hidden="true">
        <span className="loader__tile" style={{ animationDelay: '0s' }} />
        <span className="loader__tile" style={{ animationDelay: '.08s' }} />
        <span className="loader__tile" style={{ animationDelay: '.16s' }} />
        <span className="loader__tile" style={{ animationDelay: '.24s' }} />
      </div>

      <div className="loader__panels" aria-hidden="true">
        <div className="loader__panel loader__panel--wide">
          <span className="loader__line loader__line--short" />
          <span className="loader__wave" />
        </div>
        <div className="loader__panel">
          <span className="loader__line loader__line--short" />
          <span className="loader__line" />
          <span className="loader__line" />
          <span className="loader__line" />
          <span className="loader__line loader__line--mid" />
        </div>
      </div>
    </div>
  );
}
