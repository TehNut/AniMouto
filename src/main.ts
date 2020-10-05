import Vue from "vue";
import VueApollo from "vue-apollo";
import VueI18n from "vue-i18n";
import ApolloClient from "apollo-boost";
import { browser } from "webextension-polyfill-ts";

import "@/Icons"
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

Vue.config.productionTip = false;
Vue.prototype.$browser = browser;

Vue.use(VueApollo);
Vue.use(VueI18n);

async function createVueApp() {
  // Pre-load our state management
  await store.dispatch("root/load");
  await store.dispatch("settings/load");
  await store.dispatch("user/load");

  // Create our apollo client
  const token = store.getters['user/token'];
  const headers = {} as any;
  if (token)
    headers.Authorization = `Bearer ${token}`;
  const apolloProvider = new VueApollo({
    defaultClient: new ApolloClient({
      uri: "https://graphql.anilist.co",
      headers
    }),
  });
  
  new Vue({
    router,
    store,
    apolloProvider,
    render: h => h(App)
  }).$mount("#app");
}

createVueApp();