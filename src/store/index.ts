import Vue from "vue";
import Vuex from "vuex";

import root from "@/store/RootModule";
import settings from "@/store/SettingsModule";
import user from "@/store/UserModule";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  modules: {
    root,
    settings,
    user
  }
});
