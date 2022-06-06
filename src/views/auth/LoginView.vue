<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import authService from './../../services/auth.service'  
import tokenService from './../../services/token.service'  
import { useStore } from '@/stores/session.store'

const router = useRouter()
const store = useStore()

const email = ref('youssef@app.com');
const password = ref('youssef');


const login = async () => {

    try {
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
        console.log(error)
    }
}
</script>

<template> 
    <div class="login-wrapper col-md-6 m-auto ">
       <div class="form-outline mb-4">
            <label class="form-label" for="user">Utilisateur</label>
            <input type="email" id="user" v-model="email" class="form-control" />
        </div>

        <!-- Password input -->
        <div class="form-outline mb-4">
            <label class="form-label" for="mdp">Mot de passe</label>
            <input type="password" id="mdp" v-model="password" class="form-control" />
        </div>
        <button  class="btn btn-primary btn-block mb-4" @click="login">Connexion</button>
    </div>
</template>

<style lang="scss" scoped>
</style>