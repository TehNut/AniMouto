import Vue from "vue";
import VueApollo from "vue-apollo";
import ApolloClient, { InMemoryCache, IntrospectionFragmentMatcher } from "apollo-boost";
import browser from "webextension-polyfill";

import "@/Icons"
import i18n from "./i18n";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

Vue.config.productionTip = false;
Vue.prototype.$browser = browser;

Vue.use(VueApollo);

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
  // Get our fragment types
  const fragmentTypes = await fetch(browser.runtime.getURL("possibleTypes.json")).then(res => res.json());
  const apolloProvider = new VueApollo({
    defaultClient: new ApolloClient({
      cache: new InMemoryCache({
        fragmentMatcher: new IntrospectionFragmentMatcher({
          introspectionQueryResultData: fragmentTypes 
        })
      }),
      uri: "https://graphql.anilist.co",
      headers
    }),
  });
  
  new Vue({
    router,
    store,
    apolloProvider,
    i18n,
    render: h => h(App)
  }).$mount("#app");
}

createVueApp();