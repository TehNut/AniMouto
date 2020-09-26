import Vue from "vue";

import "@/Icons"
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

Vue.config.productionTip = false;

async function createVueApp() {
  await store.dispatch("root/loadLastPage");
  await store.dispatch("settings/load");
  await store.dispatch("user/loadToken");
  await store.dispatch("user/loadUser");

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
}

createVueApp();