const icon = process.env.BRANCH === 'dev' ? '/icon-dev.png' : '/icon-white.png'

export default {
  target: 'static',

  head: {
    title: 'Krab Bij Kas',
    meta: [
      { charset: 'utf-8' },
      {
        hid: 'description',
        name: 'description',
        content: "A finance tracker that's not just for the bank.",
      },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, user-scalable=0, minimal-ui, viewport-fit=cover',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
      // <meta name="theme-color" content="#872e4e" media="(prefers-color-scheme: dark)">
      {
        name: 'theme-color',
        content: '#457461',
        media: '(prefers-color-scheme: light)',
      },
      {
        name: 'theme-color',
        content: '#000000',
        media: '(prefers-color-scheme: dark)',
      },
      // <meta property="og:title" content="Your Title"/>
      // <meta property="og:description" content="A full description of the page."/>
      // <meta property="og:image" content="https://mywebsite.net/assets/opengraph/theogimage.jpg"/
      {
        property: 'og:title',
        content: 'Krab Bij Kas',
      },
      {
        property: 'og:description',
        content: "A finance tracker that's not just for the bank.",
      },
      {
        property: 'og:image',
        content: 'https://krabbijkas.nl/icon-pride.png',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: icon,
      },
      {
        rel: 'apple-touch-icon',
        href: icon,
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  },

  css: ['~assets/scss/main.scss'],

  plugins: ['./plugins/event-bus.js', './plugins/sw.client.js'],

  components: false,

  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/svg'],

  modules: ['@nuxtjs/axios'],

  server: {
    host: '0',
  },

  pwa: {
    manifest: {
      name: 'Krab Bij Kas',
      short_name: 'Krab',
      start_url: '/',
    },
    meta: {
      theme_color: '#457461',
    },
  },

  build: {},

  env: {
    REDIRECT_URL: process.env.REDIRECT_URL || 'http://localhost:8888',
  },
}
