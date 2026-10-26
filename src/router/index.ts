import { createRouter, createWebHistory } from 'vue-router'
import EmployeeDirectory from '@/views/EmployeeDirectory.vue'
import EmployeeDashboard from '@/views/EmployeeDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'employee-dashboard',
      component: EmployeeDashboard,
      meta: { requiresAuth: true },
    },
  ],
})

export default router
