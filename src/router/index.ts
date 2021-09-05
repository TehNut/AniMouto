import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Login from "@/views/Login.vue";
import MediaList from "@/views/MediaList.vue";
import Search from "@/views/Search.vue";
import Settings from "@/views/Settings.vue";
import Notifications from "@/views/Notifications.vue";
import About from "@/views/About.vue";
import Media from "@/views/Media.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [];

routes.push({
  name: "login",
  path: "/login",
  component: Login
});

routes.push({
  name: "list",
  path: "/list",
  component: MediaList
});

routes.push({
  name: "search",
  path: "/search",
  component: Search
});

routes.push({
  name: "notifications",
  path: "/notifications",
  component: Notifications
});

routes.push({
  name: "settings",
  path: "/settings",
  component: Settings
});

routes.push({
  name: "about",
  path: "/about",
  component: About
});

routes.push({
  name: "media",
  path: "/media/:id",
  component: Media
});

const router = new VueRouter({
  routes
});

export default router;
