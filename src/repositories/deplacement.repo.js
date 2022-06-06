import http from '../services/http.service'

const baseRoute = `${process.env.VUE_APP_API_URL}/deplacements`;

const deplacementRepo = {
    getAll: () => {
        return http.get(`${baseRoute}`);
    },
    index_user: () => {
        return http.get(`${baseRoute}/mes-deplacement`);
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
    print: (payload) => {
        return http.post(`${baseRoute}/print`,payload);
    },
    csv: (payload) => {
        return http.post(`${baseRoute}/csv`,payload);
    },
}

export default deplacementRepo;