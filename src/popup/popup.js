import Vue from "vue";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";
import App from "./App";
import Login from "./components/login/Login"
import MediaList from "./components/medialist/MediaList";
import Settings from "./components/settings/Settings";
import Search from "./components/search/Search";
import Notifications from "./components/notifications/Notifications";
import Spinner from "./components/base/Spinner";
import MediaView from "./components/media/MediaView";
import ForumOverview from "./components/forum/ForumOverview";
import About from "./components/about/About";
import enLang from "../assets/lang/en";

Vue.use(VueRouter);
Vue.use(VueI18n);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      component: Spinner
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
      component: ForumOverview
    },
    {
      path: "/settings",
      component: Settings
    },
    {
      path: "/about",
      component: About
    },
    {
      path: "/media/:id",
      name: "media-view",
      component: MediaView,
      props: true
    }
  ]
});

const i18n = new VueI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: {
    en: enLang
  }
});

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  i18n,
  router,
  render: h => h(App)
});
