import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: "/search"
    },
    {
      path: '/search',
      name: 'SearchHome',
      component: () => {return import("@/views/SearchHome.vue")}
    },
    {
      path: '/source_manager',
      name: 'SourceManager',
      component: () => {return import("@/views/SourceManager.vue")}
    },
    {
      path: '/source_up',
      name: 'SourceUp',
      component: () => {return import("@/views/SourceUp.vue")}
    },
    {
      path: '/star',
      name: 'Star',
      component: () => {return import("@/views/Star.vue")}
    },
    {
      path: '/about',
      name: 'About',
      component: () => {return import("@/views/About.vue")}
    }
  ]
})

export default router
