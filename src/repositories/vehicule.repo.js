import http from '../services/http.service'

const baseRoute = `${process.env.VUE_APP_API_URL}/vehicules`;

const vehiculeRepo = {
    getAll: () => {
        return http.get(`${baseRoute}`);
    },
}

export default vehiculeRepo;