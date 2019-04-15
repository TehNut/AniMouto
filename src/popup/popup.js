import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import Login from "./components/login/Login"
import Settings from "./components/Settings";
import Search from "./components/search/Search";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      component: Login
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/medialist",
      component: Settings
    },
    {
      path: "/search",
      component: Search
    },
    {
      path: "/notifications",
      component: Settings
    },
    {
      path: "/forum",
      component: Settings
    },
    {
      path: "/settings",
      component: Settings
    },
    {
      path: "/about",
      component: Settings
    },
  ]
});

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
