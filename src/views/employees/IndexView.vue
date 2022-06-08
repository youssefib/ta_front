<script setup>
import { ref, reactive } from 'vue'
import Swal from 'sweetalert2'
import * as XLSX from "xlsx";
import { Notyf } from 'notyf';

import employeeRepo from './../../repositories/employee.repo'

const notyf = new Notyf();

const employees = ref([]);

const fileData = ref([]);

const user = reactive({
    id: null,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    is_admin: false,
});

const userErrors = ref({});

const success = (message = 'succés') => {
    Swal.fire({
        icon: 'success',
        text: message,
        customClass: {
            confirmButton: 'button is-primary',
            cancelButton: 'button is-danger'
        },
        buttonsStyling: false
    })
}

const confirmation = async (message = 'Êtes-vous sûr?') => {
    return await Swal.fire({
        title: message,
        icon: 'warning',
        showCancelButton: true,
        customClass: {
            confirmButton: 'button is-primary mr-2',
            cancelButton: 'button is-danger'
        },
        buttonsStyling: false,
        confirmButtonText: 'Continuer'
    })
}

const submitEmployee = () => {
    if(user.id) {
        updateEmployee();
    } else {
        createEmployee();
    }
}

const createEmployee = async () => {
    try {
        const payload = {
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_admin: user.is_admin,
        }

        const response = await employeeRepo.create(payload);

        employees.value.push(response.data.data)

        success("L'employer a été ajouter avec succés")
    } catch (error) {
        if(error.response.status == 422) {
            userErrors.value = error.response.data.errors;
        }
    }
}

const editEmployee = (employee) => {
    user.id = employee.id
    user.email = employee.email
    user.username = employee.username
    user.first_name = employee.first_name
    user.last_name = employee.last_name
    user.is_admin = employee.is_admin
}

const updateEmployee = async () => {
    try {
        const payload = {
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_admin: user.is_admin,
        }

        const response = await employeeRepo.update(user.id, payload);

        employees.value.push(response.data.data)

        success("L'employer a été modifier avec succés")
    } catch (error) {
        if(error.response.status == 422) {
            userErrors.value = error.response.data.errors;
        }
    }
}

const deleteEmployee = async (employeeId) => {
    try {
        const confirm = await confirmation();
        
        if(!confirm.isConfirmed) {
            return;
        }

        await employeeRepo.delete(employeeId)
        employees.value = employees.value.filter(e => e.id != employeeId);

        success("L'employer a été supprimer avec succés")
    } catch (error) {
        console.log(error)
    }
}

const resetEmployee = async (employeeId) => {
    try {
        await employeeRepo.reset(employeeId);
        success("L'employer a été notifier avec succés")
    } catch (error) {
        console.log(error)
    }
}

const getEmployees = async () => {
    try {
        const response = await employeeRepo.getAll();

        employees.value = response.data.data;
    } catch (error) {
        console.log(error)
    }
}

const handleFileSelect = (event) => {
    const file = event.target.files[0]

    if(!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data);

        const sheetName = workbook.SheetNames[0]

        if(!sheetName) {
            return;
        }

        const sheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(sheet);

        fileData.value = json;
    };

    reader.readAsArrayBuffer(file);
}

const importData = async () => {

    for(const employee of fileData.value) {
        try {
            const payload = {
                username: employee.login,
                email: employee.email,
                first_name: employee.prenom,
                last_name: employee.nom,
                is_admin: employee.administrateur,
            }

            const response = await employeeRepo.create(payload)
            
            employees.value.push(response.data.data)

            success("Un employer est ajouté avec succés")
        } catch(error) {
            if(error.response?.status == 422) {
                notyf.error(error.response.data?.message);
                console.log(error.response.data?.errors)
            }
        }
    }

    console.log(fileData)
}

const getError = (field) => {
    return userErrors.value[field] ?? [];
}

const hasError = (field) => {
    if(field) {
        return !!getError(field).length;
    } else {
        Object.entries(userErrors.value);
    }
}

getEmployees();

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
                <span>Ajouter un Salarié</span>
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
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Login</th>
                    <th>Administrateur</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
        <tbody>
            <template v-for="(employee, key) in employees" :key="key">
                <tr>
                    <td>{{ employee.first_name }}</td>
                    <td>{{ employee.last_name }}</td>
                    <td>{{ employee.username }}</td>
                    <td>{{ employee.is_admin }}</td>
                    <td>
                        <button 
                            type="button" 
                            class="btn btn-light"
                            @click="deleteEmployee(employee.id)"
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
                <h5 class="modal-title">Ajouter un nouveau</h5>
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
    
    <div class="modal fade" tabindex="-1" id="importModal">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Import</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input 
                    type="file"
                    class="mb-2"
                    @change="handleFileSelect"
                    accept=".xls"
                >
                <label class="dropbox">
                    <input 
                        type="file"
                        @change="handleFileSelect"
                        accept=".xls"
                    >
                    <p v-if="fileData.length">
                        le fichier contient {{ fileData.length }} employer
                    </p>    
                </label>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button 
                    type="button" 
                    class="btn btn-primary"
                    @click="importData"
                >
                    <span>Lancer l'import</span>
                </button>
            </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.dropbox {
    height: 120pt;
    width: 100%;
    border: 1pt dashed gray;
    border-radius: 8pt;
}

.dropbox input {
    display: none;
}

</style>