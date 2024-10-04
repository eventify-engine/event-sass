// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools         : {enabled: true},
    extends          : ["@nuxt/ui-pro"],
    modules          : ["@nuxt/ui", "@vueuse/nuxt"],
    compatibilityDate: "2024-10-02",

    runtimeConfig: {
        public: {
            apiUrl      : process.env.NUXT_API_URL,
            storageUrl  : process.env.NUXT_STORAGE_URL,
            userFrontend: process.env.NUXT_USER_FRONTEND
        }
    },

    devServer: {
        host : '0.0.0.0',
        https: {
            key : './privkey.pem',
            cert: './fullchain.pem'
        }
    },

    app: {
        head: {
            meta: [
                {name: 'viewport', content: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'}
            ]
        },

        layoutTransition: {name: 'layout', mode: 'out-in'}
    }
})