<script setup>
import { ref, reactive } from "vue";
import Swal from "sweetalert2";
import vSelect from 'vue-select'

import employeeRepo from "./../../repositories/employee.repo";
import deplacementRepo from "./../../repositories/deplacement.repo";
import vehiculeRepo from "./../../repositories/vehicule.repo";
import 'vue-select/dist/vue-select.css';

// const notyf = new Notyf();

const employees = ref([]);
const deplacements = ref([]);
const vehicules = ref([]);
const selectedDeplacements = ref([]);

const deplacement = reactive({
  id: null,
  user_id: "",
  vehicule_id: "",
  date: "",
  intitule: "",
  peage: "",
  gasoil: "",
  ptm: "",
  nb_km: "",
  t_km: "",
  f_divers: 0,
  m_divers: "",
  infos: "",
  t_repas: "",
  nb_repas: "",
  m_repas: "",
  m_hotel: "",
  valider: false,
  imprime: 0,
  d_imp: null,
  print_link: "",
  export_csv: 0,
  d_csv: null,
  cvs_link: "",
});

const search = reactive({
  name: "",
  after_date: "",
  before_date: "",
  intitule: "",
  printed: "",
  exported: "",
});


const deplacementErrors = ref({});

const getError = (field) => {
  return deplacementErrors.value[field] ?? [];
};

const hasError = (field) => {
  if (field) {
    return !!getError(field).length;
  } else {
    Object.entries(deplacementErrors.value);
  }
};

const success = (message = "succés") => {
  Swal.fire({
    icon: "success",
    text: message,
    customClass: {
      confirmButton: "button is-primary",
      cancelButton: "button is-danger",
    },
    buttonsStyling: false,

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

const submitDeplacement = () => {
  if (deplacement.id) {
    updateDeplacement();
  } else {
    createDeplacement();
  }
};

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
    };

    const response = await deplacementRepo.create(payload);

    deplacements.value.push(response.data.data);

    success("Le déplacement été ajouter avec succés");
  } catch (error) {
    if (error.response.status == 422) {
      deplacementErrors.value = error.response.data.errors;
    }
  }
};

const editDeplacement = (deplac) => {
  deplacement.id = deplac.id;
  deplacement.user_id = deplac.user_id;
  deplacement.vehicule_id = deplac.vehicule_id;
  deplacement.date = deplac.date;
  deplacement.intitule = deplac.intitule;
  deplacement.peage = deplac.peage;
  deplacement.gasoil = deplac.gasoil;
  deplacement.ptm = deplac.ptm;
  deplacement.nb_km = deplac.nb_km;
  deplacement.f_divers = deplac.f_divers;
  deplacement.m_divers = deplac.m_divers;
  deplacement.infos = deplac.infos;
  deplacement.t_repas = deplac.t_repas;
  deplacement.nb_repas = deplac.nb_repas;
  deplacement.m_repas = deplac.m_repas;
  deplacement.m_hotel = deplac.m_hotel;
  deplacement.valider = deplac.valider;
  deplacement.imprime = deplac.imprime;
  deplacement.d_imp = deplac.d_imp;
  deplacement.print_link = deplac.print_link;
  deplacement.export_csv = deplac.export_csv;
  deplacement.d_csv = deplac.d_csv;
  deplacement.csv_link = deplac.csv_link;
};

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
    };

    const response = await deplacementRepo.update(deplacement.id, payload);

    deplacements.value.push(response.data.data);

    success("L'employer a été modifier avec succés");
  } catch (error) {
    if (error.response.status == 422) {
      deplacementErrors.value = error.response.data.errors;
    }
  }
};

const getEmployees = async () => {
  try {
    const response = await employeeRepo.getAll();

    employees.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const getFiltredEmployees = () => {

  return employees.value.map(e => ({ label: `${e.last_name} ${e.first_name}`, id: e.id }))
  
};

const getDeplacements = async () => {
  try {
    const response = await deplacementRepo.getAll();

    deplacements.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const getFiltredDeplacements = () => {
  if (
    search.printed == false &&
    search.name == "" &&
    search.before_date == "" &&
    search.after_date == "" &&
    search.intitule == ""
  ) {
    return deplacements.value;
  }
  const deps = deplacements.value;
  return deps.filter((dep) => {
    const fullname = dep.user.first_name.concat(dep.user.last_name).toLowerCase();
    const date = new Date(dep.date);
    const after_date = new Date(search.after_date);
    const before_date = new Date(search.before_date);
    if (after_date == "Invalid Date" && before_date == "Invalid Date") {
      return (
        fullname.match(search.name.toLowerCase()) &&
        dep.intitule.toLowerCase().match(search.intitule.toLowerCase()) &&
        dep.imprime != search.printed
      );
    } else if (after_date != "Invalid Date" && before_date == "Invalid Date") {
      return (
        fullname.match(search.name.toLowerCase()) &&
        dep.intitule.toLowerCase().match(search.intitule.toLowerCase()) &&
        date >= after_date &&
        dep.imprime != search.printed 
      );
    } else if (after_date == "Invalid Date" && before_date != "Invalid Date") {
      return (
        fullname.match(search.name.toLowerCase()) &&
        dep.intitule.toLowerCase().match(search.intitule.toLowerCase()) &&
        date <= before_date &&
        dep.imprime != search.printed 
      );
    } else if (after_date != "Invalid Date" && before_date != "Invalid Date") {
      return (
        fullname.match(search.name.toLowerCase()) &&
          dep.intitule.toLowerCase().match(search.intitule.toLowerCase())  
          && dep.imprime != search.printed
          && date >= after_date || date <= before_date
      );
    }
  });
};

const getVheicules = async () => {
  try {
    const response = await vehiculeRepo.getAll();

    vehicules.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const getTaux = () => {
  if (deplacement.vehicule_id) {
    const vehicule = vehicules.value.find((v) => v.id === deplacement.vehicule_id);
    if (vehicule.taux_km) {
      deplacement.gasoil = null;
    }
    return vehicule.taux_km;
  }
  return 0;
};

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
  const confirm = await confirmation();
  if(!confirm.isConfirmed) {
        return;
    }
  try {
    if(selectedDeplacements.value.length){
      const payload = { ids : selectedDeplacements.value }
      const response = await deplacementRepo.print(payload);
      clearSelected();
      success("Les deplacement sont bien imprimer",response.data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.download = name;
      a.href = response.data.url;
      a.target = "_blank";
      a.click();
      a.remove();
      

    
    }else{
      erreur("Merci de sélectionner au moins un déplacement");
    }  

  }catch (error) {
    const message = error.response?.data?.message ?? 'Erreur survenue'
    erreur(message);
    clearSelected();
    
  }

}

const supprimerSelection = async () => {
    var count_err = 0;
    const confirm = await confirmation();
        
    if(!confirm.isConfirmed) {
        return;
    }
    if(selectedDeplacements.value.length){
      for (let index = 0; index < selectedDeplacements.value.length; index++) {
        try {
          const response = await deplacementRepo.delete(selectedDeplacements.value[index]);
          console.log(response);
          
        } catch (error) {
          count_err = count_err + 1
        }
        
      }
      
      const supprimer = selectedDeplacements.value.length - count_err
      if(!count_err){
        success("Les deplacement sont bien supprimer");
      }else if(count_err == selectedDeplacements.value.length ){
        erreur("Aucun déplacement n'est supprimer!! Impossible de supprimer un déplacement déja valider ")
      }else{
        success(count_err + ' non supprimer ' + supprimer + ' supprimer ');
      }
      getDeplacements();
      clearSelected();
    }else{
      erreur("Merci de sélectionner au moins un déplacement ");
      clearSelected();
    }

}

const comptabiliteDeplacement = async () => {
  const confirm = await confirmation();
  if(!confirm.isConfirmed) {
        return;
    }
  try {
    if(selectedDeplacements.value.length){
      const payload = { ids : selectedDeplacements.value }
      await deplacementRepo.csv(payload);
      clearSelected();
     
      success("Les deplacement sont bien exporter");

    
    }else{
      erreur("Merci de sélectionner au moins un déplacement");
      clearSelected();

    }  

  }catch (error) {
    const message = error.response?.data?.message ?? 'Erreur survenue'
    erreur(message);
    clearSelected();

    
  }

}


const init = async () => {
  getDeplacements();
  getEmployees();
  getVheicules();
};

init();
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
        <span>Imprimer la sélection</span>
      </button>
      <button
        type="button"
        class="btn btn-light me-3"
        @click="supprimerSelection"
        
      >
        <i class="bi bi-trash me-2"></i>
        <span>Suppimer la sélection</span>
      </button>
      <button
        type="button"
        class="btn btn-light me-3"
        @click="comptabiliteDeplacement"
        
      >
        <i class="bi bi-download me-2"></i>
        <span>Importer pour la comptabilité</span>
      </button>
    </div>
    <div class="form-outline search-wrapper col-md-12 mb-3">
      <div class="row">
        <div class="col-md-4 mt-3">
          <input
            type="search"
            id="name_search"
            class="form-control"
            placeholder="Nom prenom"
            v-model="search.name"
            aria-label="Search"
          />
        </div>
        <div class="col-md-4 mt-3">
          <label for="before_date">Avent le</label>
          <input
            type="date"
            id="before_date"
            class="form-control"
            placeholder="Salariée"
            v-model="search.before_date"
            aria-label="Search"
          />
        </div>
        <div class="col-md-4 mt-3">
          <label for="after_date">après le</label>
          <input
            type="date"
            id="after_date"
            class="form-control"
            placeholder="Salariée"
            v-model="search.after_date"
            aria-label="Search"
          />
        </div>
        <div class="col-md-4 mt-3">
          <input
            type="search"
            id="intitule"
            class="form-control"
            placeholder="intitulé du deplacement"
            v-model="search.intitule"
            aria-label="Search"
          />
        </div>
        <div class="col-md-4 mt-3">
          <input type="checkbox" id="printed" name="printed" v-model="search.printed" />
          <label for="printed">Seulement les non imprimer</label>
        </div>
         <div class="col-md-4 mt-3">
          <input type="checkbox" id="exported" name="exported" v-model="search.exported" />
          <label for="exported">Seulement les non comptabiliser</label>
        </div>
      </div>
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
        <template v-for="(deplac, key) in getFiltredDeplacements()" :key="key">
          <tr>
            <td>{{ deplac.user?.first_name }} {{ deplac.user?.last_name }}</td>
            <td>{{ deplac.date }}</td>
            <td>{{ deplac.intitule }}</td>
            <td>{{ deplac.nb_repas }}</td>
            <td>{{ deplac.m_repas }}</td>
            <td>
              <span class="checkbox" :class="{ selected: isSelected(deplac.id) }" @click="toggelSelected(deplac.id)" ></span>
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
          <h5 class="modal-title">Ajouter un deplacement</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row needs-validation">
            <div class="col-md-4">
              <label class="form-label">Salarié</label>
               <v-select :options="getFiltredEmployees()" :reduce="e=> e.id" v-model="deplacement.user_id"></v-select>
              <div class="text-danger" v-if="hasError('user_id')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">Date</label>
              <input
                type="date"
                class="form-control"
                v-model="deplacement.date"
                required
              />
              <div class="text-danger" v-if="hasError('date')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-5">
              <label class="form-label">Intitulé</label>
              <input type="text" class="form-control" v-model="deplacement.intitule" />
              <div class="text-danger" v-if="hasError('intitule')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Véhicule</label><br />
              <select
                name="vehicule"
                class="form-select"
                id="vehicule-select"
                v-model="deplacement.vehicule_id"
                required
              >
                <option value="" disabled>Veuillez choisir</option>
                <template v-for="(vehicule, key) in vehicules" :key="key">
                  <option :value="vehicule.id">{{ vehicule.immat }}</option>
                </template>
              </select>
              <div class="text-danger" v-if="hasError('vehicule_id')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label">Péage</label>
              <input type="text" class="form-control" v-model="deplacement.peage" />
              <div class="text-danger" v-if="hasError('peage')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label">Gasoil</label>
              <input
                type="text"
                class="form-control"
                v-model="deplacement.gasoil"
                :disabled="getTaux() != null"
              />
              <div class="text-danger" v-if="hasError('gasoil')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label">Parking/Train/Métro</label>
              <input type="text" class="form-control" v-model="deplacement.ptm" />
              <div class="text-danger" v-if="hasError('ptm')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Nombre de Km</label>
              <input
                type="text"
                class="form-control"
                v-model="deplacement.nb_km"
                :disabled="deplacement.vehicule_id == ''"
              />
              <div class="text-danger" v-if="hasError('nb_km')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Taux Km</label>
              <template v-if="getTaux()">
                <input type="text" class="form-control" disabled :value="getTaux()" />
              </template>
              <template v-else>
                <input type="text" class="form-control" disabled />
              </template>
            </div>
            <div class="col-md-4">
              <template v-if="getTaux()">
                <label class="form-label">Montant km</label>
                <input
                  type="text"
                  class="form-control"
                  :value="getTaux() * deplacement.nb_km"
                />
              </template>
              <template v-else>
                <label class="form-label">Montant km</label>
                <input
                  type="text"
                  class="form-control"
                  :value="deplacement.nb_km * deplacement.gasoil"
                />
              </template>
            </div>
            <div class="col-md-6">
              <label class="form-label">Type de repas </label><br />
              <select
                name="t_repas"
                class="form-select"
                id="t_repas-select"
                v-model="deplacement.t_repas"
              >
                <option value="" disabled>Veuillez choisir</option>
                <option value="Normal">Normal</option>
                <option value="Réception client">Réception client</option>
                <option value="Repas emporté">Repas emporté</option>
              </select>
              <div class="text-danger" v-if="hasError('t_repas')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label">Nombre de repas</label>
              <input type="text" class="form-control" v-model="deplacement.nb_repas" />
              <div class="text-danger" v-if="hasError('nb_repas')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label">Montant repas</label>
              <input type="text" class="form-control" v-model="deplacement.m_repas" />
              <div class="text-danger" v-if="hasError('m_repas')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label">Montant hôtel</label>
              <input type="text" class="form-control" v-model="deplacement.m_hotel" />
              <div class="text-danger" v-if="hasError('gasoil')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Frais divers </label><br />
              <select
                name="f_divers"
                class="form-select"
                id="f_divers-select"
                v-model="deplacement.f_divers"
              >
                <option value="0" selected="selected">Non</option>
                <option value="1">OUi</option>
              </select>
              <div class="text-danger" v-if="hasError('f_divers')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label">Montant divers</label>
              <input
                type="text"
                class="form-control"
                v-model="deplacement.m_divers"
                :disabled="deplacement.f_divers == 0"
              />
              <div class="text-danger" v-if="hasError('nb_repas')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Autre infos</label>
              <input
                type="text"
                class="form-control"
                v-model="deplacement.infos"
                :disabled="deplacement.f_divers == 0"
              />
              <div class="text-danger" v-if="hasError('infos')">
                <small> Ce champ est obligatoire </small>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <template v-if="deplacement.imprime">
              <div class="text-danger me-3" >
                <a :href="deplacement.print_link" target="_blank"> Imprimer le {{ deplacement.d_imp }}</a>
              </div>
          </template>
          <template v-if="deplacement.export_csv">
              <div class="text-danger me-3" >
                  <a :href="deplacement.csv_link" target="_blank"> exporter le {{ deplacement.d_csv }}</a>
              </div>
          </template>
          
          <template v-if="deplacement.valider">
            <input
              class="form-check-input"
              type="checkbox"
              :id="deplacement.id"
              name="valider"
              checked
              disabled
            /><label for=""> Valider </label>
          </template>
          <template v-else>
            <input
              class="form-check-input"
              type="checkbox"
              :id="deplacement.id"
              v-model="deplacement.valider"
              name="valider"
            /><label for=""> Valider </label>
          </template>

          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Fermer
          </button>
          <button type="button" class="btn btn-primary" @click="submitDeplacement">
            <span>Sauvgarder</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  --bs-modal-width: 900px !important;
}
.form-outline .row {
  align-items: flex-end;
}

.checkbox {width: 10pt; height: 10pt; border: 1pt solid gray;display: inline-flex; } 
.checkbox.selected { background-color: black }
.checkbox.disable{pointer-events: none; background-color: red}
</style>
