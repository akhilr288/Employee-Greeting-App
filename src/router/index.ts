import { createRouter, createWebHistory } from 'vue-router'

import PortalLayout from '@/layouts/PortalLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import EmployeesView from '@/views/EmployeesView.vue'
import EmployeeDetailsView from '@/views/EmployeeDetailsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/SettingsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: PortalLayout,
      children: [
        {
          path: 'dashboard',
          alias: '/',
          name: 'Dashboard',
          component: DashboardView,
        },
        {
          path: 'employees',
          name: 'Employees',
          component: EmployeesView,
        },
        {
          path: 'employees/:id',
          name: 'EmployeeDetails',
          component: EmployeeDetailsView,
          props: true,
        },
        {
          path: 'profile',
          name: 'Profile',
          component: ProfileView,
        },
        {
          path: 'settings',
          name: 'Settings',
          component: SettingsView,
        },
      ],
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

export default router
