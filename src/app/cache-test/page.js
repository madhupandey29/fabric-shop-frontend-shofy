// app/cache-test/page.tsx
export const revalidate = 60 * 60 * 24; // 24h
export const dynamic = 'force-static';

export default function CacheTestPage() {
  const builtAt = new Date().toISOString();
  return (
    <main style={{fontFamily: 'ui-sans-serif, system-ui', padding: 24}}>
      <h1 style={{fontSize: 20, marginBottom: 8}}>ISR Cache Test</h1>
      <p>Built at (server render time): <b>{builtAt}</b></p>
      <p style={{marginTop: 12}}>
        First request should be <code>MISS</code>, subsequent ones <code>HIT</code> or <code>STALE</code> (within 24h).  
      </p>
      <p style={{marginTop: 6}}>
        Try: <code>curl -I https://your-domain.com/cache-test</code>
      </p>
    </main>
  );
}
