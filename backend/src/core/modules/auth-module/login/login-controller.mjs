import { LoginService } from './login-service.mjs';

export class LoginController {

	static #instance;
	#loginService;

	get loginService() {

		if (!this.#loginService) {

			this.#loginService = LoginService.getInstance();
		}
		
		return this.#loginService;
	}

	static getInstance() {

		if (!LoginController.#instance) {
	
			LoginController.#instance = new LoginController();
		}
	
		return LoginController.#instance;
	}

	async login(req, res) {

		return this.loginService.login(req, res);
	}
}