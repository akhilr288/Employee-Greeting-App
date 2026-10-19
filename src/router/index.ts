import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Login' },
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('../views/ForbiddenView.vue'),
      meta: { title: 'Access denied' },
    },
    {
      path: '/shopping',
      name: 'shopping',
      component: () => import('../views/ShoppingView.vue'),
      meta: { title: 'Shopping Store' },
    },
    {
      path: '/',
      component: () => import('../layouts/PortalLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/shopping',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'employees',
          name: 'employees',
          component: () => import('../views/EmployeesView.vue'),
          meta: {
            roles: ['ADMIN', 'HR'],
            title: 'Employees',
          },
        },
        {
          path: 'employees/:id',
          name: 'employee-details',
          component: () => import('../views/EmployeeDetailsView.vue'),
          props: true,
          meta: {
            roles: ['ADMIN', 'HR'],
            title: 'Employee details',
          },
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
          meta: { title: 'My profile' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue'),
          meta: {
            roles: ['ADMIN'],
            title: 'Settings',
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Page not found' },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // 1. Authentication check
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  // 2. Authorization check
  if (to.meta.roles && !auth.hasAnyRole(to.meta.roles)) {
    if (!auth.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }

    return { name: 'forbidden' }
  }

  return true
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title ?? 'Employee Portal')} | Employee Portal`
})

export default router
