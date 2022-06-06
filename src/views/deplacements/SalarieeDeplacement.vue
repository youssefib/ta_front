<script setup>
import { ref,reactive} from 'vue'
import Swal from 'sweetalert2'
// import { Notyf } from 'notyf';

import employeeRepo from './../../repositories/employee.repo'
import deplacementRepo from './../../repositories/deplacement.repo'
import vehiculeRepo from './../../repositories/vehicule.repo'

// const notyf = new Notyf();

const deplacements = ref([]);
const vehicules = ref([]);
const currentUser = ref([]);
const selectedDeplacements = ref([]);



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

const success = (message = "succés",response) => {
  Swal.fire({
    icon: "success",
    text: message,
    customClass: {
      confirmButton: "button is-primary",
      cancelButton: "button is-danger",
    },
    buttonsStyling: false,
    footer: response

  });
};

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
            user_id: currentUser.value.id,
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
            vehicule_id: deplacement.vehicule_id,
            user_id: currentUser.value.id,
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




const getDeplacements = async () => {

     try {
        const response = await deplacementRepo.index_user();

        deplacements.value = response.data.data;
        } catch (error) {
            console.log(error)
      }
}

const search = reactive({
    after_date:'',
    before_date:'',
    intitule:'',
    printed:'',

});

const getFiltredDeplacements = () => {

    if(search.printed == false && search.before_date == '' && search.after_date == '' && search.intitule == '' ){
        return deplacements.value;
    }
    const dep = deplacements.value;
    return dep.filter((dep) => {
        const date = new Date(dep.date);
        const after_date = new Date(search.after_date);
        const before_date = new Date(search.before_date);
        if(after_date == 'Invalid Date' && before_date == 'Invalid Date' ){
            return dep.intitule.toLowerCase().match(search.intitule.toLowerCase()) && dep.imprime == search.printed ;
        }else if(after_date != 'Invalid Date' && before_date == 'Invalid Date'){
            return dep.intitule.toLowerCase().match(search.intitule.toLowerCase()) &&  date >= after_date && dep.imprime == search.printed ;
        }else if(after_date == 'Invalid Date' && before_date != 'Invalid Date'){
            return dep.intitule.toLowerCase().match(search.intitule.toLowerCase()) &&  date <= before_date && dep.imprime == search.printed ;
        }else if(after_date != 'Invalid Date' && before_date != 'Invalid Date'){
            return dep.intitule.toLowerCase().match(search.intitule.toLowerCase()) &&  date >= after_date ||  date <= before_date && dep.imprime == search.printed ;
        }
    });

}

const userFullName = () => {

  return currentUser.value.first_name.concat(currentUser.value.last_name);
  
};

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
        if(vehicule.taux_km){
            deplacement.gasoil = null
        }
        return vehicule.taux_km
    }

    return 0
    
}


const isSelected = (deplacement_id) => {
  return selectedDeplacements.value.includes(deplacement_id)
}

const toggelSelected = (deplacement_id) => {
  const selected = isSelected(deplacement_id)
  if(selected){
    const index = selectedDeplacements.value.indexOf(deplacement_id);
      if (index > -1) {
        selectedDeplacements.value.splice(index, 1); 
      }

  }else{
    selectedDeplacements.value.push(deplacement_id)
  }
}

const clearSelected =() => {
  selectedDeplacements.value.splice(0,selectedDeplacements.value.length); 
}

const printDeplacement = async () => {
  try {
    if(selectedDeplacements.value.length){
      const payload = { ids : selectedDeplacements.value }
      const response = await deplacementRepo.print(payload);
      clearSelected();
     
      console.log(response.data)
      success("Les deplacement sont bien imprimer",response.data);

    
    }else{
      erreur("Merci de sélectionner au moins un déplacement");
    }  

  }catch (error) {
    erreur("Merci de choisir une selection valide");
    
  }

}



const init = async () => {
    await getCurrentUser();
    getDeplacements();
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
                class="btn btn-light me-3"
                @click="printDeplacement"
            >
                <i class="bi bi-printer me-2"></i>
                <span>Imprimer la selction</span>
            </button>
        </div>
        <div class="form-outline search-wrapper col-md-12 mb-3">
            <div class="row">
                <div class="col-md-3 mt-3">
                    <label for="before_date">Avent le</label>
                    <input type="date" id="before_date" class="form-control" placeholder="Salariée"  v-model="search.before_date" aria-label="Search" />
                </div>
                <div class="col-md-3 mt-3">
                    <label for="after_date">après le</label>
                    <input type="date" id="after_date" class="form-control" placeholder="Salariée"  v-model="search.after_date" aria-label="Search" />
                </div>
                <div class="col-md-3 mt-3">
                    <input type="search" id="intitule" class="form-control" placeholder="intitulé du deplacement"  v-model="search.intitule" aria-label="Search" />
                </div>
                <div class="col-md-3 mt-3">
                   <input type="checkbox" id="printed" name="printed" v-model="search.printed"/>
                    <label for="printed">Seulement les non imprimer</label>
                </div>
            </div>
        </div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Déplacement</th>
                    <th>Nb repas</th>
                    <th>Montant total</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
        <tbody>
            <template v-for="(deplac, key) in getFiltredDeplacements()" :key="key">
                <tr>
                    <td>{{ deplac.date }}</td>
                    <td>{{ deplac.intitule }}</td>
                    <td>{{ deplac.nb_repas }}</td>
                    <td>{{ deplac.m_repas }}</td>
                    <template v-if="deplac.imprime">
                        <td>
                            <span class="checkbox disable" ></span>
                        </td>
                    </template>
                    <template v-else>
                        <td>
                            <span class="checkbox" :class="{ selected: isSelected(deplac.id) }" @click="toggelSelected(deplac.id)" ></span>
                        </td>
                    </template>
                    
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
                <h5 class="modal-title">Deplacements</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row needs-validation">
                    <div class="col-md-4">
                        <label class="form-label">Salarié</label>
                        <input type="text" class="form-control" :value="userFullName()" disabled required />
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Date</label>
                        <input type="date" class="form-control" v-model="deplacement.date" required />
                        <div class="text-danger" v-if="hasError('date')">
                            <small>
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">Intitulé</label>
                        <input type="text" class="form-control" v-model="deplacement.intitule" />
                        <div class="text-danger" v-if="hasError('intitule')">
                            <small>
                               Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Véhicule</label><br>
                        <select name="vehicule"   class="form-select"   id="vehicule-select" v-model="deplacement.vehicule_id" required>
                            <option value="" disabled>Veuillez choisir</option>
                            <template v-for="(vehicule, key) in vehicules" :key="key">
                                <option :value="vehicule.id" >{{vehicule.immat}}</option>
                            </template>
                        </select>
                         <div class="text-danger" v-if="hasError('vehicule_id')">
                            <small>
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Péage</label>
                        <input type="text" class="form-control" v-model="deplacement.peage" />
                        <div class="text-danger" v-if="hasError('peage')">
                            <small>
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Gasoil</label>
                        <input type="text" class="form-control" v-model="deplacement.gasoil"  :disabled="getTaux() != null"/>
                        <div class="text-danger" v-if="hasError('gasoil')">
                            <small>
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Parking/Train/Métro</label>
                        <input type="text" class="form-control" v-model="deplacement.ptm" />
                        <div class="text-danger" v-if="hasError('ptm')">
                            <small>
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Nombre de Km</label>
                        <input type="text" class="form-control" v-model="deplacement.nb_km" :disabled="deplacement.vehicule_id =='' " />
                        <div class="text-danger" v-if="hasError('nb_km')">
                            <small>
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Taux  Km</label>
                        <template v-if="getTaux()">
                            <input type="text" class="form-control" disabled :value="getTaux()" />
                        </template>
                        <template v-else>
                            <input type="text" class="form-control" disabled/>
                        </template>
                    </div>
                    <div class="col-md-4">
                        <template v-if="getTaux()">
                            <label class="form-label">Montant km</label>
                            <input type="text" class="form-control" :value="getTaux() * deplacement.nb_km" />
                        </template>
                        <template v-else>
                            <label class="form-label">Montant km</label>
                            <input type="text" class="form-control" :value="deplacement.nb_km * deplacement.gasoil" />
                        </template>
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
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Nombre de repas</label>
                        <input type="text" class="form-control" v-model="deplacement.nb_repas" />
                        <div class="text-danger" v-if="hasError('nb_repas')">
                            <small>
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Montant repas</label>
                        <input type="text" class="form-control" v-model="deplacement.m_repas" />
                        <div class="text-danger" v-if="hasError('m_repas')">
                            <small>
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Montant hôtel</label>
                        <input type="text" class="form-control" v-model="deplacement.m_hotel" />
                        <div class="text-danger" v-if="hasError('gasoil')">
                            <small>
                                Ce champ est obligatoire
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
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">Montant divers</label>
                        <input type="text" class="form-control" v-model="deplacement.m_divers" :disabled="deplacement.f_divers == 0" />
                        <div class="text-danger" v-if="hasError('nb_repas')">
                            <small>
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Autre infos</label>
                        <input type="text" class="form-control" v-model="deplacement.infos" :disabled="deplacement.f_divers == 0"/>
                        <div class="text-danger" v-if="hasError('infos')">
                            <small>
                                Ce champ est obligatoire
                            </small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
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
.form-outline .row {align-items: flex-end;}
.checkbox {width: 10pt; height: 10pt; border: 1pt solid gray;display: inline-flex; } 
.checkbox.selected { background-color: black }
.checkbox.disable{pointer-events: none; background-color: red}

</style>