import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import webpack from 'webpack';

const isProd = process.env.NODE_ENV === 'production';
const baseUrl = process.env.BASE_URL || '/';

const config: Config = {
  title: "St Joseph's Curriculum Portal",
  tagline: 'Education for All — Offline-First Curriculum Engine',
  favicon: 'favicon.ico',

  url: 'https://josephbrewerton-oss.github.io',
  baseUrl,

  organizationName: 'josephbrewerton-oss',
  projectName: 'schoolsample',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/x-icon',
        href: `${baseUrl}favicon.ico`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `${baseUrl}img/favicon-32x32.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: `${baseUrl}img/favicon-16x16.png`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: `${baseUrl}img/logo.svg`,
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: `${baseUrl}img/apple-touch-icon.png`,
      },
    },
  ],

  scripts: [
    {
      src: `${baseUrl}js/webrtc-agent.js`,
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
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
                'process.env.PWA_OFFLINE_MODE_ACTIVATION_STRATEGIES': JSON.stringify([
                  'appInstalled',
                  'standalone',
                  'queryString',
                ]),
                'process.env.PWA_SERVICE_WORKER_URL': JSON.stringify(`${baseUrl}sw.js`),
                'process.env.PWA_DEBUG': JSON.stringify(false),
              }),
            ],
          };
        },
      };
    },

    ...(isProd
      ? [
          [
            '@docusaurus/plugin-pwa',
            {
              debug: false,
              offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
              swRegister: false,
              pwaHead: [
                {
                  tagName: 'link',
                  rel: 'icon',
                  href: `${baseUrl}img/favicon-32x32.png`,
                },
                {
                  tagName: 'link',
                  rel: 'manifest',
                  href: `${baseUrl}manifest.json`,
                },
              ],
            },
          ],
        ]
      : []),
  ],

  themeConfig: {
    image: 'img/logo.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "St Joseph's Portal",
      logo: {
        alt: 'School Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/practice-lab',
          label: '⚡ Practice',
          position: 'left',
        },
        {
          to: '/learning-zone',
          label: '📖 Lessons',
          position: 'left',
        },
        {
          to: '/profile',
          label: '⭐ Progress',
          position: 'left',
        },
        {
          to: '/curriculum-studio',
          label: '🌍 Studio',
          position: 'left',
        },
        {
          to: '/blog',
          label: '📰 News',
          position: 'left',
        },
        {
          to: '/settings',
          label: '⚙️ Settings',
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
            {
              label: '🌍 International Curriculum Studio',
              to: '/curriculum-studio',
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