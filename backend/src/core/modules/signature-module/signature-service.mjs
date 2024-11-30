import crypto from 'crypto';

export class SignatureService {

    static #instance;
    #privateKey;
    #publicKey;

    constructor(privateKey, publicKey) {

        this.#privateKey = privateKey;
        this.#publicKey = publicKey;
    }

    get privateKey() {

        return this.#privateKey;
    }

    get publicKey() {
            
        return this.#publicKey;
    }

    static getInstance() {

        if (!this.#instance) {
            this.#instance = new SignatureService();
        }

        return this.#instance;
    }

    signDocument() {

        const { document } = req.body;

        if (!document) {

            return res.status(400).send('Documento não fornecido');
        }

        const sign = crypto.createSign('SHA256');
        sign.update(document);
        sign.end();

        const signature = sign.sign(this.privateKey, 'hex');

        res.json({ document, signature });
    }

    verifySignature() {

        const { document, signature } = req.body;

        if (!document || !signature) {

            return res.status(400).send('Documento ou assinatura não fornecidos');
        }

        const verify = crypto.createVerify('SHA256');
        verify.update(document);
        verify.end();

        const isValid = verify.verify(this.publicKey, signature, 'hex');

        res.json({ isValid });
    }
}