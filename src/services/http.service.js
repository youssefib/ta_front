import axios from "axios";
import tokenService from './token.service'

axios.interceptors.request.use(
	function(config) {
		const token = tokenService.getToken();

		config.headers = {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
		};

		return config;
	},
	function(error) {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
	if(error.response.status == 401) {
		tokenService.setToken('');
		// window.location.href = '/';
	}

	return Promise.reject(error);
  });

const http = {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete,
};

export default http;