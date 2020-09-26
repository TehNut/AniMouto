import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Login from "@/views/Login.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [];

routes.push({
  path: "/login",
  component: Login
});

const router = new VueRouter({
  routes
});

export default router;
