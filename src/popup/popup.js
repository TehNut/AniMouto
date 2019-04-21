import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import Login from "./components/login/Login"
import MediaList from "./components/medialist/MediaList";
import Settings from "./components/settings/Settings";
import Search from "./components/search/Search";
import Notifications from "./components/notifications/Notifications";
import Spinner from "./components/base/Spinner";

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
      component: MediaList
    },
    {
      path: "/search",
      component: Search
    },
    {
      path: "/notifications",
      component: Notifications
    },
    {
      path: "/forum",
      component: Spinner
    },
    {
      path: "/settings",
      component: Settings
    },
    {
      path: "/about",
      component: Spinner
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
