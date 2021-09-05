import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Login from "@/views/Login.vue";
import MediaList from "@/views/MediaList.vue";
import Search from "@/views/Search.vue";
import Settings from "@/views/Settings.vue";
import Notifications from "@/views/Notifications.vue";
import About from "@/views/About.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [];

routes.push({
  path: "/login",
  component: Login
});

routes.push({
  path: "/list",
  component: MediaList
});

routes.push({
  path: "/search",
  component: Search
});

routes.push({
  path: "/notifications",
  component: Notifications
});

routes.push({
  path: "/settings",
  component: Settings
});

routes.push({
  path: "/about",
  component: About
})

const router = new VueRouter({
  routes
});

export default router;
