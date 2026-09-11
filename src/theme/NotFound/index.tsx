// src/theme/NotFound/index.tsx
import React from 'react';
import { PageMetadata } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import NotFoundContent from '@theme/NotFound/Content';

export default function Index(): React.JSX.Element {
  return (
    <>
      <PageMetadata title="Curriculum Node Harmonised | St Joseph's" />
      <Layout>
        <NotFoundContent />
      </Layout>
    </>
  );
}
