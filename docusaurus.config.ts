import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'School AI Portal',
  tagline: 'Interactive Learning Powered by Local AI',
  favicon: 'img/favicon.ico',

  // Load the WebRTC client script across all pages (prefixed with baseUrl)
  scripts: [
    {
      src: '/schoolsample/js/webrtc-agent.js',
      async: true,
    },
  ],

  // Set the production url and baseUrl for GitHub Pages
  url: 'https://josephbrewerton-oss.github.io',
  baseUrl: '/schoolsample/',

  // GitHub Pages deployment config
  organizationName: 'josephbrewerton-oss',
  projectName: 'schoolsample',
  trailingSlash: false,

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
          label: 'Lessons',
        },
        {to: '/blog', label: 'News', position: 'left'},
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
          title: 'Curriculum',
          items: [
            {
              label: 'Primary Years 1-6',
              to: '/docs/primary-years-1-6/ks2-science',
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
