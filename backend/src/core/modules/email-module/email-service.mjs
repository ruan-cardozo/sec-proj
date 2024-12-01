import nodemailer from 'nodemailer';
import { _log } from '../../../common/helper/logger.mjs';

export class EmailService {

    static #instance;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: '172.21.0.8',
            port: 1025,
            ignoreTLS: true,
            secure: false
        });
    }

    static getInstance() {
        if (!EmailService.#instance) {
            EmailService.#instance = new EmailService();
        }
        return EmailService.#instance;
    }

    async sendEmail(to, documentId) {
        _log(`Sending email to: ${to}`);
        
        const signLink = `http://localhost:5173/sign-document/${documentId}`;
        const mailOptions = {
            from: 'nao-responda@cyber-sec.com', // Remetente
            to: to,
            subject: 'Assinatura de relatório de horas semanais',
            text: 'Olá, você tem um novo relatório de horas semanais para assinar.',
            html: 
        `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 10px 0;
                    text-align: center;
                }
                .content {
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    color: #777777;
                    font-size: 12px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Relatório de Horas Semanais</h1>
                </div>
                <div class="content">
                    <p>Olá,</p>
                    <p>Você tem um novo relatório de horas semanais para assinar.</p>
                    <p>Por favor, acesse o link abaixo: </p>
                    <p><a href="${signLink}">Clique aqui para assinar o documento</a></p>
                </div>
                <div class="footer">
                    <p>Este é um email automático, por favor, não responda.</p>
                </div>
            </div>
        </body>
        </html>
        `
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            _log('Erro ao enviar email: ', error);
        }
    }
}