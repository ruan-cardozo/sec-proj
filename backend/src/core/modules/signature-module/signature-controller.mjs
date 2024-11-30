import { SignatureService } from './signature-service.mjs';

export class SignatureController {

    static #instance;
    #signatureService;

    constructor(privateKey, publicKey) {
        this.#signatureService = SignatureService.getInstance(privateKey, publicKey);
        ['signDocument'].forEach(method => {
            this[method] = this[method].bind(this);
        });
    }

    static getInstance() {

        if (!this.#instance) {
            this.#instance = new SignatureController();
        }
        return this.#instance;
    }

    get signatureService () {

        return this.#signatureService;
    }

    async signDocument(req, res) {

        return this.signatureService.signDocument(req, res);
    }
}