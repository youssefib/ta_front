import http from '../services/http.service'

const baseRoute = `${process.env.VUE_APP_API_URL}/deplacements`;

const deplacementRepo = {
    getAll: () => {
        return http.get(`${baseRoute}`);
    },
    index_user: () => {
        return http.get(`${baseRoute}/salarie-deplacement`);
    },
    get: (deplacementId) => {
        return http.get(`${baseRoute}/${deplacementId}`);
    },
    create: (payload) => {
        return http.post(`${baseRoute}`, payload);
    },
    update: (deplacementId, payload) => {
        return http.put(`${baseRoute}/${deplacementId}`, payload);
    },
    delete: (deplacementId) => {
        return http.delete(`${baseRoute}/${deplacementId}`);
    },
}

export default deplacementRepo;