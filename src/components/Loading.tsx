interface LoadingProps {
  label?: string;
}

export function Loading({ label = 'Connecting to the event stream' }: LoadingProps) {
  return (
    <output className="empty-state" aria-live="polite">
      <span className="loading-orbit" aria-hidden="true" />
      <p>{label}</p>
    </output>
  );
}
