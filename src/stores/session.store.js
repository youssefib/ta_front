import { acceptHMRUpdate,defineStore } from 'pinia'
import { ref,computed} from 'vue'


export const useStore = defineStore('session', ()=>{

    const user = ref({})
    function setUser(newUser) {
        user.value = newUser
    }
    const isLogged = computed(() => {return !!user.value?.first_name})
    return {user, setUser,isLogged}
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}