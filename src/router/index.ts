import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      component: () => import('@/views/WelcomeView.vue')
    },
    {
      path: '/dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/collection',
      component: () => import('@/views/CollectionView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/game/:id',
      component: () => import('@/views/GameDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/add',
      component: () => import('@/views/AddGameView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.loggedIn) {
    return '/'
  }
})

export default router
