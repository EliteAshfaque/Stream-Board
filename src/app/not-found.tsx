import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="app-shell">
      <div className="not-found">
        <p className="not-found__code">404</p>
        <h1>Page not found</h1>
        <p>That URL is not part of Stream Board.</p>
        <Link href="/">Back to dashboard</Link>
      </div>
    </main>
  );
}
