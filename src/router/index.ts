import {createRouter, createWebHistory, type RouteLocationNormalized} from "vue-router";
// @ts-ignore
import CatalogView from "@/views/CatalogView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:catchAll(.*)",
      redirect: "/",
    },
    {
      path: "/",
      name: "Home",
      redirect: "/nouveautes",
      children: [
        {
          path: "nouveautes",
          name: "Nouveautes",
          component: CatalogView,
          meta: {
            title: "Nouvelles Baskets & Chaussures",
          },
        },
      ],
    },
  ],
});

const setMetaTitle = (title: string) => {
  document.title = `${title} - Nike`;
};

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  setMetaTitle(to.meta.title as string);
  return true;
});

export default router;
