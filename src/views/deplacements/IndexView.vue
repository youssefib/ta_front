<script setup>
import { ref, reactive } from 'vue'
// import Swal from 'sweetalert2'
// import { Notyf } from 'notyf';

import employeeRepo from './../../repositories/employee.repo'
import deplacementRepo from './../../repositories/deplacement.repo'

// const notyf = new Notyf();

const employees = ref([]);
const deplacements = ref([]);

// const fileData = ref([]);

const user = reactive({
    id: null,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    is_admin: false,
});


// const deplacement = reactive({
//     id: null,
//     username: '',
//     email: '',
//     first_name: '',
//     last_name: '',
//     is_admin: false,
// });


// const userErrors = ref({});





const getEmployees = async () => {
    try {
        const response = await deplacementRepo.getAll();

        deplacements.value = response.data.data;
    } catch (error) {
        console.log(error)
    }
}



getEmployees();

const getDeplacement = async () => {
    try {
        const response = await employeeRepo.getAll();

        employees.value = response.data.data;
    } catch (error) {
        console.log(error)
    }
}

getDeplacement();

</script>

<template>
    <div>
        <div class="actions-wrapper">
            <button 
                type="button" 
                class="btn btn-light me-3"
                data-bs-toggle="modal" 
                data-bs-target="#userModal"
            >
                <i class="bi bi-plus-circle me-2"></i>
                <span>Ajouter un Déplacements</span>
            </button>
            <button 
                type="button" 
                class="btn btn-light"
                data-bs-toggle="modal" 
                data-bs-target="#importModal"
            >
                <i class="bi bi-plus-circle me-2"></i>
                <span>Importé xls</span>
            </button>
        </div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Salarie</th>
                    <th>Date</th>
                    <th>Déplacement</th>
                    <th>Administrateur</th>
                    <th>Nb repas</th>
                    <th>Montant total</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
        <tbody>
            <template v-for="(deplacement, key) in deplacements" :key="key">
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <button 
                            type="button" 
                            class="btn btn-light"
                        >
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                    <td>
                        <button 
                            type="button" 
                            class="btn btn-light"
                            @click="editEmployee(employee)"
                            data-bs-toggle="modal" 
                            data-bs-target="#userModal"
                        >
                            <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                </tr>
            </template>
        </tbody>
        </table>
    </div>
    <div class="modal fade" tabindex="-1" id="userModal">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row needs-validation">
                    <div class="col-md-6">
                        <label class="form-label">Prénom</label>
                        <input type="text" class="form-control" v-model="user.first_name" />
                        <div class="text-danger" v-if="hasError('first_name')">
                            <small>
                                {{ getError('first_name').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Nom</label>
                        <input type="text" class="form-control" v-model="user.last_name" />
                        <div class="text-danger" v-if="hasError('last_name')">
                            <small>
                                {{ getError('last_name').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Login</label>
                        <input type="text" class="form-control" v-model="user.username" />
                        <div class="text-danger" v-if="hasError('username')">
                            <small>
                                {{ getError('username').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" v-model="user.email" />
                        <div class="text-danger" v-if="hasError('email')">
                            <small>
                                {{ getError('email').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input type="checkbox" class="form-check-input m-1" v-model="user.is_admin" />
                        <label class="form-label">Administrateur</label>
                        <div class="text-danger" v-if="hasError('is_admin')">
                            <small>
                                {{ getError('is_admin').join(', ') }}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button 
                    type="button" 
                    class="btn btn-primary"
                    @click="submitEmployee"
                >
                    <span>Sauvgarder</span>
                </button>
                <button 
                    type="button" 
                    class="btn btn-primary"
                    @click="resetEmployee(user.id)"
                >
                    <span>Renvoi MDP</span>
                </button>
            </div>
            </div>
        </div>
    </div>
    
</template>

<style scoped>



</style>