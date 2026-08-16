import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home() {
  return (
    <Layout title="Home" description="School AI Learning Portal">
      <main style={{ padding: '4rem', textAlign: 'center' }}>
        <h1>Welcome to School AI Portal</h1>
        <p>Interactive lessons powered by internal WebRTC AI.</p>
        <div style={{ marginTop: '2rem' }}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Start Learning ??
          </Link>
        </div>
      </main>
    </Layout>
  );
}
