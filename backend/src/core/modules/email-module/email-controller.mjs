import { EmailService } from './email-service.mjs';

export class EmailController {

    static #instance;
    #emailService;

    constructor() {

        this.#emailService = EmailService.getInstance();
        ['sendEmail'].forEach(method => {
            this[method] = this[method].bind(this);
        });
    }

    static getInstance() {

        if (!EmailController.#instance) {

            EmailController.#instance = new EmailController();
        }

        return EmailController.#instance;
    }

    get emailService() {

        return this.#emailService;
    }

    async sendEmail(req, res) {

    const { to, documentId } = req.body;

        return this.emailService.sendEmail(to, documentId);
    }
}