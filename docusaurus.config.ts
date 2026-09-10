import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import webpack from 'webpack';

const isProd = process.env.NODE_ENV === 'production';
const baseUrl = process.env.BASE_URL || '/';

const config: Config = {
  title: 'St Joseph',
  tagline: 'Education for All — Offline-First Curriculum Engine',
  favicon: 'img/favicon.ico',

  url: 'https://josephbrewerton-oss.github.io',
  baseUrl,

  organizationName: 'josephbrewerton-oss',
  projectName: 'schoolsample',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

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
    // 1. Webpack Polyfill Plugin to resolve 'process is not defined' without clobbering plugin env variables
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

    // 2. Production PWA Plugin with explicit baseUrl scoping
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
                  href: `${baseUrl}img/docusaurus.png`,
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
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "St Joseph's Learning Portal",
      logo: {
        alt: 'School Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/practice-lab',
          label: '⚡ Practice Arena',
          position: 'left',
        },
        {
          to: '/learning-zone',
          label: '📖 Curriculum Lessons',
          position: 'left',
        },
        {
          to: '/profile',
          label: '⭐ My Progress',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'School News',
          position: 'left',
        },
        {
          to: '/curriculum-studio',
          label: '🌍 Curriculum Studio',
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

const config: Config = {
  title: 'St Joseph',
  tagline: 'Education for All — Offline-First Curriculum Engine',
  favicon: 'img/favicon.ico',

  url: 'https://josephbrewerton-oss.github.io',
  baseUrl,

  organizationName: 'josephbrewerton-oss',
  projectName: 'schoolsample',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

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
    // 1. Webpack Polyfill Plugin to resolve 'process is not defined' without clobbering plugin env variables
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

    // 2. Production PWA Plugin with explicit baseUrl scoping
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
                  href: `${baseUrl}img/docusaurus.png`,
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
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "St Joseph's Learning Portal",
      logo: {
        alt: 'School Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/practice-lab',
          label: '⚡ Practice Arena',
          position: 'left',
        },
        {
          to: '/learning-zone',
          label: '📖 Curriculum Lessons',
          position: 'left',
        },
        {
          to: '/profile',
          label: '⭐ My Progress',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'School News',
          position: 'left',
        },
        {
          to: '/curriculum-studio',
          label: '🌍 Curriculum Studio',
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
