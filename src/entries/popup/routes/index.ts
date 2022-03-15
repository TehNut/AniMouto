import { get } from "svelte/store";
import type { RouteDefinition, RoutePrecondition } from "svelte-spa-router";
import { wrap } from "svelte-spa-router/wrap";
import { loggedIn } from "$lib/store";

const authRequired: RoutePrecondition = () => get(loggedIn);
const authBlocked: RoutePrecondition = () => !get(loggedIn);

const routes: RouteDefinition = {
  "/": wrap({ 
    asyncComponent: () => import("./Login.svelte"),
    conditions: [ authBlocked ]
  }),
  "/medialist": wrap({
    asyncComponent: () => import("./MediaList.svelte"),
    conditions: [ authRequired ]
  }),
  "/new": wrap({
    asyncComponent: () => import("./New.svelte")
  }),
  "/search": wrap({
    asyncComponent: () => import("./Search.svelte")
  }),
  "/notifications": wrap({
    asyncComponent: () => import("./Notifications.svelte"),
    conditions: [ authRequired ]
  }),
  "/settings": wrap({
    asyncComponent: () => import("./Settings.svelte") 
  }),
  "/media/:id": wrap({
    asyncComponent: () => import("./media/index.svelte")
  }),
};

export default routes;