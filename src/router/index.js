import { createRouter, createWebHistory } from 'vue-router'
import tokenService from './../services/token.service'
import { useStore } from '@/stores/session.store'

import authLoginView from '../views/auth/LoginView.vue'

import EmployeeIndexView from '../views/employees/IndexView.vue'
import DeplacementIndexView from '../views/deplacements/IndexView.vue'
import MesdeplacementsIndexView from '../views/deplacements/SalarieeDeplacement.vue'
import employeeRepo from '../repositories/employee.repo'


const getCurrentUser = async () => {
  try {
      const response = await employeeRepo.currentUser();

      return response.data.data;
  } catch (error) {
      console.log(error)
  }
}

const routes = [
  { 
    path: '/', 
    name: 'home',
    redirect: { 
      name: 'mes-deplacements.index' 
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
    meta: {
      admin: true,
    }
  },
  {
    path: '/deplacements/',
    name: 'deplacements.index',
    component: DeplacementIndexView,
    meta: {
      admin: true,
    }
  },
  {
    path: '/mes-deplacements/',
    name: 'mes-deplacements.index',
    component: MesdeplacementsIndexView,
    
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const init =  async () => {
  const store = useStore()
  const isLogged = store.isLogged;

  if(!isLogged) {
      const token = tokenService.getToken();
      if(token) {
          const user = await getCurrentUser();
          store.setUser(user)
      }
  }
}

router.beforeEach( async (to, from, next) => {
  await init();
  const store = useStore()
  const isGuarded = to.meta?.admin;
  const isAuth = !to.meta?.guest;
  const isAdmin = store.user?.is_admin;
  const isLogged = store.isLogged;

  const rediretToAuth = isAuth ? !isLogged : false;
  const notAuthorize = isGuarded ? !isAdmin : false;
  
  if (rediretToAuth) {
      next({ name: "auth.login" });
      return;
  }
  if (notAuthorize) {
    next({ name: "home" });
    return;
  }
  next();
});

export default router
