import { createRouter, createWebHistory } from 'vue-router'
import tokenService from './../services/token.service'

import authLoginView from '../views/auth/LoginView.vue'

import EmployeeIndexView from '../views/employees/IndexView.vue'

const routes = [
  { 
    path: '/', 
    name: 'home',
    redirect: { 
      name: 'employees.index' 
    } 
  },
  {
    path: '/auth/login',
    name: 'auth.login',
    component: authLoginView,
    meta: {
      guest: true,
    }
  },
  {
    path: '/employees/',
    name: 'employees.index',
    component: EmployeeIndexView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = tokenService.getToken();

  if (!to.meta?.guest && !token) next({ name: "auth.login" });
  else if (to.meta?.guest && token) next({ name: "home" });
  else next();
});

export default router
