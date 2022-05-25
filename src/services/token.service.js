const tokenService = {
    getToken() {
        return window.localStorage.getItem('token');
    },
    setToken(token) {
        window.localStorage.setItem('token', token);
    }
}

export default tokenService;