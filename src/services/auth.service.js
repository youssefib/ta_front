import httpService from "./http.service";
import tokenService from './token.service';

const baseRoute = `${process.env.VUE_APP_API_URL}/auth`;

const AuthService = {
	login: (credentials) => {
		return httpService.post(`${baseRoute}/login`, credentials);
	},
	logout: () => {
		tokenService.setToken('');
	}
};

export default AuthService;