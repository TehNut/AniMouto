import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Login from "@/views/Login.vue";
import MediaList from "@/views/MediaList.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [];

routes.push({
  path: "/login",
  component: Login
});

routes.push({
  path: "/list",
  component: MediaList
})

const router = new VueRouter({
  routes
});

export default router;
