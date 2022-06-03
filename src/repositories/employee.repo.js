import http from './../services/http.service'

const baseRoute = `${process.env.VUE_APP_API_URL}/users`;

const employeeRepo = {
    getAll: () => {
        return http.get(`${baseRoute}`);
    },
    currentUser: () => {
        return http.get(`${baseRoute}/currentUser`);
    },
    get: (employeeId) => {
        return http.get(`${baseRoute}/data/${employeeId}`);
    },
    create: (payload) => {
        return http.post(`${baseRoute}`, payload);
    },
    update: (employeeId, payload) => {
        return http.put(`${baseRoute}/${employeeId}`, payload);
    },
    delete: (employeeId) => {
        return http.delete(`${baseRoute}/${employeeId}`);
    },
    reset: (employeeId) => {
        return http.get(`${baseRoute}/${employeeId}/reset`);
    },
}

export default employeeRepo;