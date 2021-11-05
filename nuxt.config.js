export default {
  target: 'static',
  head: {
    title: 'BudgetDuck',
    meta: [
      { charset: 'utf-8' },
      { hid: 'description', name: 'description', content: '' },
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
        content: '#000000',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['~assets/scss/main.scss'],

  plugins: [],

  components: false,

  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/svg'],

  modules: ['@nuxtjs/axios', '@nuxtjs/pwa', '@nuxt/content'],

  server: {
    host: '0',
  },

  pwa: {
    manifest: {
      name: 'BudgetDuck',
      short_name: 'BudgetDuck',
      start_url: '/',
    },
    meta: {
      theme_color: '#457461',
    },
  },

  content: {},

  build: {},
}
