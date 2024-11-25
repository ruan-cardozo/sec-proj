import { LoginService } from './login-service.mjs';

export class LoginController {

	static #instance;
	#loginService;

	constructor() {
		this.#loginService = LoginService.getInstance();
		this.login = this.login.bind(this); 
	}

	get loginService() {

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