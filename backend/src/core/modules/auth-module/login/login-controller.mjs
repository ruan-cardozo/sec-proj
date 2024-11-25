import { LoginService } from './login-service.mjs';

export class LoginController {

	static #instance;
	#loginService;

	constructor() {
		this.#loginService = LoginService.getInstance();
		['login', 'checkToken'].forEach(method => {
			this[method] = this[method].bind(this);
		});
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

	async checkToken(req, res) {
		
		return this.loginService.checkToken(req, res);
	}
}