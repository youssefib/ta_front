<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import authService from './../../services/auth.service'  
import tokenService from './../../services/token.service'  

const router = useRouter()

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

        router.push({ name: 'home' })

    } catch (error) {
        console.log(error)
    }
}
</script>

<template>
    <div class="login-wrapper">
        <label>
            <span>Email</span>
            <input type="email" v-model="email">
        </label>
        <label>
            <span>Password</span>
            <input type="password" v-model="password">
        </label>
        <button @click="login">login</button>
    </div>
</template>

<style lang="scss" scoped>
</style>