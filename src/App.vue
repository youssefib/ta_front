<script setup>
  import authService from './services/auth.service'
  import { useRouter } from 'vue-router'
import { useStore } from '@/stores/session.store'


  const router = useRouter();
  const store = useStore()


  const logout = () => {
    authService.logout();
    store.setUser(null);
    router.push({ name: 'auth.login' })

  }

</script>

<template>
<div class="container py-3">
  <header>
    <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
      <template v-if="store.isLogged">
        <nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto">
          <template v-if="store.user.is_admin">
            <router-link to="/employees" class="me-3 py-2 text-dark text-decoration-none">Employees</router-link>
            <router-link to="/deplacements" class="me-3 py-2 text-dark text-decoration-none">Deplacements</router-link>
          </template>
            <router-link to="/mes-deplacements" class="me-3 py-2 text-dark text-decoration-none">Mes deplacements</router-link>
            <a class="me-3 py-2 text-dark text-decoration-none" @click.prevent="logout">Logout</a>
          </nav>
      </template>
     
    </div>
  </header>

  <main>
    <router-view/>
  </main>

</div>
</template>