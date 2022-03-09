import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,
  target: 'static',
  generate: {
    dir: process.env.DEPLOY_DIR || 'dist',
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - hms-admin',
    title: 'hms-admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/overrides.sass'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-pluginså
  plugins: [
    '~/plugins/vee-validate',
    '~/plugins/base',
    '~/plugins/chartist',
    // '~/plugins/model',
  ],

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'login',
        path: '',
        component: resolve(__dirname, 'pages/user/login.vue'),
      })
    },
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',

    '@nuxtjs/apollo',
    '@nuxtjs/firebase',
    // https://github.com/shakee93/vue-toasted
    '@nuxtjs/toast',
    '@nuxtjs/dotenv',
  ],

  apollo: {
    clientConfigs: {
      default: '~/plugins/apollo-config.js',
    },
    defaultOptions: {
      // See 'apollo' definition
      // For example: default query options
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'network-only',
      },
    },

    // setup a global query loader observer (see below for example)
    watchLoading: '~/plugins/apollo-watch-loading-handler.js',

    // setup a global error handler (see below for example)
    errorHandler: '~/plugins/apollo-error-handler.js',

    // Sets the authentication type for any authorized request.
    authenticationType: 'Bearer',

    // Token name for the cookie which will be set in case of authentication
    tokenName: 'apollo-token',
  },
  toast: {
    position: 'top-right',
    duration: 3000,
    iconPack: 'mdi',
    keepOnHover: true,
    register: [
      // Register custom toasts
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error',
        },
      },
    ],
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'vi',
    },
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vee-validate/dist/rules'],
    extend(config, ctx) {},
  },
  server: {
    host: '0.0.0.0', // default: localhost,
    timing: false,
  },

  firebase: {
    config: {
      apiKey: 'AIzaSyArVeDEa0vRiK4g3s2hACyvCQul0uKssvo',
      authDomain: 'ent-hms.firebaseapp.com',
      databaseURL: 'https://ent-hms-default-rtdb.firebaseio.com',
      projectId: 'ent-hms',
      storageBucket: 'ent-hms.appspot.com',
      messagingSenderId: '911014492216',
      appId: '1:911014492216:web:01862da5a9173708f50ecd',
      measurementId: 'G-9X4C18M5M3',
    },
    services: {
      auth: true, // Just as example. Can be any other service.
    },
  },
}
