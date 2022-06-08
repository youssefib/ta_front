<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import authService from './../../services/auth.service'  
import tokenService from './../../services/token.service'  
import { useStore } from '@/stores/session.store'
import Swal from 'sweetalert2'


const router = useRouter()
const store = useStore()

const email = ref('');
const password = ref('');

const erreur = (message = "erreur") => {
  Swal.fire({
    icon: "error",
    text: message,
    customClass: {
      confirmButton: "button is-primary",
      cancelButton: "button is-danger",
    },
    buttonsStyling: false,
  });
};

const login = async () => {

    try {
        if(email.value == ''){
            erreur("Email est obligatoire");
            return;
        }
         if(password.value == ''){
            erreur("Le mot de passe est obligatoire");
            return;
        }
        const payload = {
            email: email.value,
            password: password.value,
        }

        const response = await authService.login(payload);

        tokenService.setToken(response.data.access_token);

        store.setUser(response.data.user);
        
        if(response.data.user.is_admin){
            router.push({ name: 'home' })

        }else{
            router.push({ name: 'mes-deplacements.index' })
        }


    } catch (error) {
        erreur("Email ou mot de passe incorrect");
        
    }
}
</script>

<template> 
    <div class="login-wrapper col-md-6 m-auto ">
       <div class="form-outline mb-4">
            <label class="form-label" for="user">Email</label>
            <input type="email" id="user" v-model="email" class="form-control" />
        </div>

        <!-- Password input -->
        <div class="form-outline mb-4">
            <label class="form-label" for="mdp">Mot de passe</label>
            <input type="password" id="mdp" required v-model="password" class="form-control" />
        </div>
        <button  class="btn btn-primary btn-block mb-4" @click="login">Connexion</button>
    </div>
</template>

<style lang="scss" scoped>
</style>