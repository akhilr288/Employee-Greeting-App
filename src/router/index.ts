import { createRouter, createWebHistory } from 'vue-router'
import EmployeeDashboard from '@/views/EmployeeDashboard.vue'
import EmployeeDirectoryView from '@/views/EmployeeDirectoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: EmployeeDirectoryView },
    { path: '/employee-dashboard', component: EmployeeDashboard },
  ],
})

export default router
