import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: 'login' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('@/views/EmployeesView.vue'),
      // meta: {
      //   requiresAuth: false,
      //   roles: ['ADMIN', 'HR'],
      // },
    },
    {
      path: '/employees/:id',
      name: 'employee-details',
      component: () => import('@/views/EmployeeDetailsView.vue'),
      props: true,
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('@/views/ForbiddenView.vue'),
    },
    {
      path: '/employee-management',
      name: 'employee-management',
      component: () => import('@/views/EmployeeManagementView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Restore and validate the user after a page refresh.
  if (auth.token && !auth.user) {
    try {
      await auth.fetchUser()
    } catch {
      // Do not enter a protected route when identity cannot be verified.
      if (to.meta.requiresAuth) {
        return {
          name: 'login',
          query: { redirect: to.fullPath },
        }
      }
    }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  if (to.meta.roles && (!auth.role || !to.meta.roles.includes(auth.role))) {
    return { name: 'forbidden' }
  }
})

export default router
