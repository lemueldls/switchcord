import type { NuxtConfig } from "@nuxt/types";

// import colors from "vuetify/lib/util/colors";

const config: NuxtConfig = {
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    // titleTemplate: "%s - Switchcord",
    title: "Switchcord",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // { hid: "description", name: "description", content: "" },
    ],
    // link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "@mdi/font/scss/materialdesignicons.scss",
    "roboto-fontface/css/roboto/sass/roboto-fontface.scss",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // // https://vite.nuxtjs.org
    // "nuxt-vite",
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/stylelint
    "@nuxtjs/stylelint-module",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    // https://composition-api.nuxtjs.org
    "@nuxtjs/composition-api/module",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    defaultAssets: false,
    theme: {
      dark: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      themes: {
        dark: {
          primary: "#5865f2",
          secondary: "#424242",
          accent: "#82B1ff",
          error: "#e60012",
          info: "#2196F3",
          success: "#57f287",
          warning: "#fee75c",
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      config.target = "electron-renderer";
    },
  },
};

export default config;
