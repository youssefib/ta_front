<script setup>
import { ref,reactive} from 'vue'
import Swal from 'sweetalert2'
// import { Notyf } from 'notyf';

import employeeRepo from './../../repositories/employee.repo'
import deplacementRepo from './../../repositories/deplacement.repo'
import vehiculeRepo from './../../repositories/vehicule.repo'

// const notyf = new Notyf();

const employees = ref([]);
const deplacements = ref([]);
const vehicules = ref([]);
const currentUser = ref([]);



const deplacement = reactive({
    id: null,
    user_id: '',
    vehicule_id: '',
    date: '',
    intitule: '',
    peage: '',
    gasoil: '',
    ptm: '',
    nb_km: '',
    t_km: '',
    f_divers: 0,
    m_divers: '',
    infos: '',
    t_repas: '',
    nb_repas: '',
    m_repas: '',
    m_hotel: '',
    valider: 0,
    imprime: 0,
    salariee: '',
});


const deplacementErrors = ref({});

const getError = (field) => {
    return deplacementErrors.value[field] ?? [];
}

const hasError = (field) => {
      if(field) {
        return !!getError(field).length;
    } else {
        Object.entries(deplacementErrors.value);
    }
}

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

const submitDeplacement = () => {
    if(deplacement.id) {
        updateDeplacement();
    } else {
        createDeplacement();
    }
}

const createDeplacement = async () => {
    try {
        const payload = {
            user_id: deplacement.user_id,
            vehicule_id: deplacement.vehicule_id,
            date: deplacement.date,
            intitule: deplacement.intitule,
            peage: deplacement.peage,
            gasoil: deplacement.gasoil,
            ptm: deplacement.ptm,
            nb_km: deplacement.nb_km,
            f_divers: deplacement.f_divers,
            m_divers: deplacement.m_divers,
            infos: deplacement.infos,
            t_repas: deplacement.t_repas,
            nb_repas: deplacement.nb_repas,
            m_repas: deplacement.m_repas,
            m_hotel: deplacement.m_hotel,
            valider: deplacement.valider,
            imprime: deplacement.imprime,
        }

        const response = await deplacementRepo.create(payload);

        deplacements.value.push(response.data.data)

        success("Le déplacement été ajouter avec succés")
    } catch (error) {
        if(error.response.status == 422) {
            deplacementErrors.value = error.response.data.errors;
        }
    }
}

const editDeplacement = (deplac) => {
    deplacement.id          = deplac.id
    deplacement.user_id     = deplac.user_id
    deplacement.vehicule_id = deplac.vehicule_id
    deplacement.date        = deplac.date
    deplacement.intitule    = deplac.intitule
    deplacement.peage       = deplac.peage
    deplacement.gasoil      = deplac.gasoil
    deplacement.ptm         = deplac.ptm
    deplacement.nb_km       = deplac.nb_km
    deplacement.f_divers    = deplac.f_divers
    deplacement.m_divers    = deplac.m_divers
    deplacement.infos       = deplac.infos
    deplacement.t_repas     = deplac.t_repas
    deplacement.nb_repas    = deplac.nb_repas
    deplacement.m_repas     = deplac.m_repas
    deplacement.m_hotel     = deplac.m_hotel
    deplacement.valider     = deplac.valider
    deplacement.imprime     = deplac.imprime
}


const updateDeplacement = async () => {
    try {
        const payload = {
            user_id: deplacement.user_id,
            vehicule_id: deplacement.vehicule_id,
            date: deplacement.date,
            intitule: deplacement.intitule,
            peage: deplacement.peage,
            gasoil: deplacement.gasoil,
            ptm: deplacement.ptm,
            nb_km: deplacement.nb_km,
            f_divers: deplacement.f_divers,
            m_divers: deplacement.m_divers,
            infos: deplacement.infos,
            t_repas: deplacement.t_repas,
            nb_repas: deplacement.nb_repas,
            m_repas: deplacement.m_repas,
            m_hotel: deplacement.m_hotel,
            valider: deplacement.valider,
            imprime: deplacement.imprime,
        }

        const response = await deplacementRepo.update(deplacement.id, payload);

        deplacements.value.push(response.data.data)

        success("L'employer a été modifier avec succés")
    } catch (error) {
        if(error.response.status == 422) {
            deplacementErrors.value = error.response.data.errors;
        }
    }
}

const getCurrentUser = async () => {
    try {
        const response = await employeeRepo.currentUser();

        currentUser.value = response.data.data;
    } catch (error) {
        console.log(error)
    }
}



const getEmployees = async () => {

     if(currentUser.value.is_admin){
        try {
        const response = await employeeRepo.getAll();

        employees.value = response.data.data;
        } catch (error) {
            console.log(error)
        }
    }
}


const getDeplacements = async () => {

    console.log(currentUser.value)
    if(currentUser.value.is_admin){
        try {
        const response = await deplacementRepo.getAll();

        deplacements.value = response.data.data;
        } catch (error) {
            console.log(error)
        }
    }else{
        try {
        const response = await deplacementRepo.index_user();

        deplacements.value = response.data.data;
        } catch (error) {
            console.log(error)
        }
    }
}

const getVheicules = async () => {
    try {
        const response = await vehiculeRepo.getAll();

        vehicules.value = response.data.data;
    } catch (error) {
        console.log(error)
    }
}


const getTaux = () => {
    if(deplacement.vehicule_id){
        const vehicule = vehicules.value.find( v => v.id === deplacement.vehicule_id)
        return vehicule.taux_km
    }

    return 0
    
}

const init = async () => {
    await getCurrentUser();
    getDeplacements();
    getEmployees();
    getVheicules();
}

init()


</script>

<template>
    <div>
        <div class="actions-wrapper">
            <button 
                type="button" 
                class="btn btn-light me-3"
                data-bs-toggle="modal" 
                data-bs-target="#deplacementModal"
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
                    <th>Nb repas</th>
                    <th>Montant total</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
        <tbody>
            <template v-for="(deplac, key) in deplacements" :key="key">
                <tr>
                    <td>{{ deplac.user?.first_name }} {{ deplac.user?.last_name }}</td>
                    <td>{{ deplac.date }}</td>
                    <td>{{ deplac.intitule }}</td>
                    <td>{{ deplac.nb_repas }}</td>
                    <td>{{ deplac.m_repas }}</td>
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
                            @click="editDeplacement(deplac)"
                            data-bs-toggle="modal" 
                            data-bs-target="#deplacementModal"
                        >
                            <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                </tr>
            </template>
        </tbody>
        </table>
     </div>
   <div class="modal fade" tabindex="-1" id="deplacementModal">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row needs-validation">
                    <div class="col-md-4">
                        <label class="form-label">Salarié</label>
                        <template v-if="currentUser.is_admin">
                            <select name="employee"   class="form-select"   id="employee-select" v-model="deplacement.user_id">
                                <option value="" disabled>Veuillez choisir</option>
                                <template v-for="(employee, key) in employees" :key="key">
                                    <option :value="employee.id" >{{employee.first_name}} {{employee.last_name}}</option>
                                </template>
                            </select>
                            <div class="text-danger" v-if="hasError('user_id')">
                                <small>
                                    {{ getError('user_id').join(', ') }}
                                </small>
                            </div>
                            
                        </template>
                        <template v-else>
                            <input type="text" class="form-control" v-model="deplacement.user_id" :value="currentUser.id" disabled />
                            <div class="text-danger" v-if="hasError('user_id')">
                                <small>
                                    {{ getError('user_id').join(', ') }}
                                </small>
                            </div>
                        </template>
                       
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Date</label>
                        <input type="date" class="form-control" v-model="deplacement.date" />
                        <div class="text-danger" v-if="hasError('date')">
                            <small>
                                {{ getError('date').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">Intitulé</label>
                        <input type="text" class="form-control" v-model="deplacement.intitule" />
                        <div class="text-danger" v-if="hasError('intitule')">
                            <small>
                                {{ getError('intitule').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Véhicule</label><br>
                        <select name="vehicule"   class="form-select"   id="vehicule-select" v-model="deplacement.vehicule_id">
                            <option value="" disabled>Veuillez choisir</option>
                            <template v-for="(vehicule, key) in vehicules" :key="key">
                                <option :value="vehicule.id" >{{vehicule.immat}}</option>
                            </template>
                        </select>
                         <div class="text-danger" v-if="hasError('vehicule_id')">
                            <small>
                                {{ getError('vehicule_id').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Péage</label>
                        <input type="text" class="form-control" v-model="deplacement.peage" />
                        <div class="text-danger" v-if="hasError('peage')">
                            <small>
                                {{ getError('peage').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Gasoil</label>
                        <input type="text" class="form-control" v-model="deplacement.gasoil" />
                        <div class="text-danger" v-if="hasError('gasoil')">
                            <small>
                                {{ getError('gasoil').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Parking/Train/Métro</label>
                        <input type="text" class="form-control" v-model="deplacement.ptm" />
                        <div class="text-danger" v-if="hasError('ptm')">
                            <small>
                                {{ getError('ptm').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Nombre de Km</label>
                        <input type="text" class="form-control" v-model="deplacement.nb_km" />
                        <div class="text-danger" v-if="hasError('nb_km')">
                            <small>
                                {{ getError('nb_km').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Taux  Km</label>
                        <!-- <template v-for="(vehicule, key) in vehicules" :key="key">
                            <template v-if="vehicule.id == deplacement.vehicule_id">
                                <template v-if="vehicule.taux_km != null">
                                    <input type="text" class="form-control" v-model="deplacement.t_km" disabled :placeholder="vehicule.taux_km" :value="vehicule.taux_km" />
                                </template>
                                <template v-else>
                                    <input type="text" class="form-control" v-model="deplacement.t_km" />
                                </template>
                                <div class="text-danger" v-if="hasError('t_km')">
                                    <small>
                                        {{ getError('t_km').join(', ') }}
                                    </small>
                                </div>
                            </template>
                        </template> -->
                        <template v-if="getTaux()">
                            <input type="text" class="form-control" disabled :value="getTaux()" />
                        </template>
                        <template v-else>
                            <input type="text" class="form-control" v-model="deplacement.t_km"  />
                        </template>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Montant km</label>
                        <input type="text" class="form-control" :value="deplacement.t_km * deplacement.nb_km" />
                        
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Type de repas </label><br>
                        <select name="t_repas"   class="form-select"   id="t_repas-select" v-model="deplacement.t_repas">
                            <option value="" disabled>Veuillez choisir</option>
                            <option value="Normal" >Normal</option>
                            <option value="Réception client" >Réception client</option>
                            <option value="Repas emporté" >Repas emporté</option>
                        </select>
                         <div class="text-danger" v-if="hasError('t_repas')">
                            <small>
                                {{ getError('t_repas').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Nombre de repas</label>
                        <input type="text" class="form-control" v-model="deplacement.nb_repas" />
                        <div class="text-danger" v-if="hasError('nb_repas')">
                            <small>
                                {{ getError('nb_repas').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Montant repas</label>
                        <input type="text" class="form-control" v-model="deplacement.m_repas" />
                        <div class="text-danger" v-if="hasError('m_repas')">
                            <small>
                                {{ getError('m_repas').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Montant hôtel</label>
                        <input type="text" class="form-control" v-model="deplacement.m_hotel" />
                        <div class="text-danger" v-if="hasError('gasoil')">
                            <small>
                                {{ getError('gasoil').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Frais divers </label><br>
                        <select name="f_divers"   class="form-select"   id="f_divers-select" v-model="deplacement.f_divers">
                            <option value="0" selected="selected">Non</option>
                            <option value="1" >OUi</option>
                            </select>
                         <div class="text-danger" v-if="hasError('f_divers')">
                            <small>
                                {{ getError('f_divers').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Montant divers</label>
                        <input type="text" class="form-control" v-model="deplacement.m_divers" :disabled="deplacement.f_divers == 0" />
                        <div class="text-danger" v-if="hasError('nb_repas')">
                            <small>
                                {{ getError('nb_repas').join(', ') }}
                            </small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Autre infos</label>
                        <input type="text" class="form-control" v-model="deplacement.infos" :disabled="deplacement.f_divers == 0"/>
                        <div class="text-danger" v-if="hasError('infos')">
                            <small>
                                {{ getError('infos').join(', ') }}
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
                    @click="submitDeplacement"
                >
                    <span>Sauvgarder</span>
                </button>
            </div>
            </div>
        </div>
    </div>
    
</template>

<style scoped>

.modal{--bs-modal-width: 900px !important;}

</style>