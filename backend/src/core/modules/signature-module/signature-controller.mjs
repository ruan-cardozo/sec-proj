import { SignatureService } from './signature-service.mjs';

export class SignatureController {

    static #instance;
    #signatureService;

    constructor(privateKey, publicKey) {
        this.#signatureService = SignatureService.getInstance(privateKey, publicKey);
        ['signDocument', 'verifySignature'].forEach(method => {
            this[method] = this[method].bind(this);
        });
    }

    static getInstance(privateKey, publicKey) {

        if (!this.#instance) {
            this.#instance = new SignatureController(privateKey, publicKey);
        }
        return this.#instance;
    }

    get signatureService () {

        return this.#signatureService;
    }

    async signDocument(req, res) {

        return this.signatureService.signDocument(req, res);
    }

    async verifySignature(req, res) {

        return this.signatureService.verifySignature(req, res);
    }

}