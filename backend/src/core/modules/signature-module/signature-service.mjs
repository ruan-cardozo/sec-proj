import crypto from 'crypto';
import { MongoDB } from '../../../config/mongo.mjs';
import mongoose from "mongoose";
import { PDFDocument, rgb } from "pdf-lib";

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

    static getInstance(privateKey, publicKey) {

        if (!this.#instance) {

            this.#instance = new SignatureService(privateKey, publicKey);
        }

        return this.#instance;
    }

    async signDocument(req, res) {

        const { documentId, userName } = req.body;

        console.log(userName);

        if (!documentId) {

            return res.status(400).send('ID do documento não fornecido');
        }

        const document = await this._getDocumentById(documentId);
        const fileBuffer = Buffer.from(document.file.buffer);

        if (!document) {

            return res.status(400).send('Documento não fornecido');
        }

        const sign = crypto.createSign('SHA256');
        sign.update(fileBuffer);
        sign.end();

        const pdfDoc = await PDFDocument.load(fileBuffer);

        const signature = sign.sign(this.privateKey, 'hex');
        const pages = pdfDoc.getPages();
        const lastPage = pages[pages.length - 1];

        lastPage.drawText('Assinatura do Gestor:', {
            x: 14,
            y: 130,
            size: 12,
            color: rgb(0, 0, 0),
        });


        lastPage.drawText(userName, {
            x: 14,
            y: 110,
            size: 10,
            color: rgb(0, 0, 0),
        });

        lastPage.drawLine({
            start: { x: 14, y: 100 },
            end: { x: 110, y: 100 },
            thickness: 1,
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();

        const signedDocument = {
            name: `Assinado por ${userName}`,
            documentId: documentId,
            userId: req.user.id,
            pdfBuffer: Buffer.from(pdfBytes),
            signature: signature,
            publicKey: this.publicKey
        }

        const mongo = MongoDB.getInstance();

        await mongo.connect();

        const db = mongoose.connection;

        const collection = db.collection('signed_pdfs');

        await collection.insertOne(signedDocument);

        return res.json({ signedDocument: Array.from(pdfBytes) });
    }

    async _getDocumentById(documentId) {

        const mongo = MongoDB.getInstance();
        await mongo.connect();
        const db = mongoose.connection;

        const collection = db.collection('pdfs');

        const document = await collection.findOne({ _id: new mongoose.Types.ObjectId(documentId) });

        return document;
    }

    async verifySignature(req, res) {
        console.log('req.body', req.body);
        const { documentId } = req.body;
        console.log(documentId);
        if (!documentId) {
            return res.status(400).send('ID do documento não fornecido');
        }
    
        const signedDocument = await this._getSignedDocumentById(documentId);
        
    
        if (!signedDocument) {
            return res.status(404).send('Documento assinado não encontrado');
        }
    
        const { pdfBuffer, signature, publicKey, name } = signedDocument;
    
        const pdfBufferData = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer.buffer);

        const verify = crypto.createVerify('SHA256');
        verify.update(pdfBufferData);
        verify.end();
    
        const isValid = verify.verify(publicKey, signature, 'hex');

        return res.json({ isValid: isValid, message: `O documento ${name} é valido` });
    }

    async _getSignedDocumentById(documentId) {
        const mongo = MongoDB.getInstance();
        await mongo.connect();
        const db = mongoose.connection;

        const collection = db.collection('signed_pdfs');

        const signedDocument = await collection.findOne({_id: new mongoose.Types.ObjectId(documentId)});

        return signedDocument;
    }
}