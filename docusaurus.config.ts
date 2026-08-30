import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import webpack from 'webpack';

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

  scripts: [
    {
      src: '/schoolsample/js/webrtc-agent.js',
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

plugins: [
    // 1. Webpack Polyfill Plugin to resolve 'process is not defined'
    function webpackPolyfillPlugin() {
      return {
        name: 'custom-webpack-polyfill',
        configureWebpack() {
          return {
            plugins: [
              new webpack.ProvidePlugin({
                process: 'process/browser',
              }),
              new webpack.DefinePlugin({
                'process.env': JSON.stringify({}),
              }),
            ],
          };
        },
      };
    },

    // 2. Production PWA Plugin with explicit baseUrl scoping
    ...(isProd
      ? [
          [
            '@docusaurus/plugin-pwa',
            {
              debug: false,
              offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
              pwaHead: [
                {
                  tagName: 'link',
                  rel: 'icon',
                  href: '/schoolsample/img/docusaurus.png',
                },
                {
                  tagName: 'link',
                  rel: 'manifest',
                  href: '/schoolsample/manifest.json',
                },
              ],
            },
          ],
        ]
      : []),
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