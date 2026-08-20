import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'School AI Portal',
  tagline: 'Interactive Learning Powered by Local AI',
  favicon: 'img/favicon.ico',

  // Production URL and baseUrl for GitHub Pages
  url: 'https://josephbrewerton-oss.github.io',
  baseUrl: '/schoolsample/',

  // GitHub Pages deployment config
  organizationName: 'josephbrewerton-oss',
  projectName: 'schoolsample',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  // Load WebRTC client script across all pages using relative path
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
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/josephbrewerton-oss/schoolsample/tree/main/',
        },
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

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'School AI Portal',
      logo: {
        alt: 'School AI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Practice Lab',
        },
        {
          to: '/blog',
          label: 'News',
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

  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          { tagName: 'link', rel: 'icon', href: '/schoolsample/img/logo.svg' },
          { tagName: 'link', rel: 'manifest', href: '/schoolsample/manifest.json' },
          { tagName: 'meta', name: 'theme-color', content: '#2563eb' },
        ],
      },
    ],
  ],
};

export default config;