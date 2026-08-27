import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const isProd = process.env.NODE_ENV === 'production';

const config: Config = {
  title: 'St Joseph',
  tagline: 'Education for All — Offline-First Curriculum Engine',
  favicon: 'img/favicon.ico',

  url: 'https://josephbrewerton-oss.github.io',
  baseUrl: '/schoolsample/',

  organizationName: 'josephbrewerton-oss',
  projectName: 'schoolsample',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  headTags: [
    {
      tagName: 'script',
      attributes: {
        type: 'text/javascript',
      },
      innerHTML: 'window.process = window.process || { env: { NODE_ENV: "production" } };',
    },
  ],

  scripts: [
    {
      src: 'js/webrtc-agent.js',
      async: true,
    },
  ],

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

// docusaurus.config.js
plugins: [
  [
    '@docusaurus/plugin-pwa',
    {
      debug: false,
      offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
      pwaHead: [
        {
          tagName: 'link',
          rel: 'icon',
          href: '/img/docusaurus.png',
        },
        {
          tagName: 'link',
          rel: 'manifest',
          href: '/manifest.json',
        },
      ],
    },
  ],
],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "St Joseph's",
      logo: {
        alt: 'School AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/practice-lab',
          label: 'Practice Lab',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'News',
          position: 'left',
        },
        {
          to: '/learning-zone',
          label: 'Learning Zone',
          position: 'left',
        },
        {
          to: '/settings',
          label: '⚙️ Settings & Access',
          position: 'right',
        },
        {
          href: 'https://github.com/josephbrewerton-oss/schoolsample',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Workspace',
          items: [
            {
              label: 'Interactive Practice Lab',
              to: '/practice-lab',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub Repository',
              href: 'https://github.com/josephbrewerton-oss/schoolsample',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} School AI Portal. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;