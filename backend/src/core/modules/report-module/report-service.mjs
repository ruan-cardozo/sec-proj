import { MongoDB } from "../../../config/mongo.mjs";
import mongoose from "mongoose";
import { PDFDocument } from "pdf-lib";

export class ReportService {

    static #instance;

    static getInstance() {

        if (!ReportService.#instance) {

            ReportService.#instance = new ReportService();
        }

        return ReportService.#instance;
    }

    async getOneReport(req, res) {
        try {
            const mongo = MongoDB.getInstance();
            await mongo.connect();
            const db = mongoose.connection;
    
            const collection = db.collection('pdfs');
    
            const report = await collection.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });
    
            if (!report) {
                return res.status(404).json({ message: 'Relatório não encontrado' });
            }
    
            // Envia o PDF diretamente como resposta
            res.setHeader('Content-Type', report.fileType);
            res.send(report.file.buffer);
        } catch (error) {
            console.error('Erro ao buscar relatório:', error);
            res.status(500).json({ message: 'Houve um erro ao buscar o relatório', error });
        }
    }

    async getAllReports(req, res) {
        try {
            const mongo = MongoDB.getInstance();
            await mongo.connect();
            const db = mongoose.connection;

            const collection = db.collection('pdfs');

            const reports = await collection.find().toArray();

            res.status(200).json(reports);
        } catch (error) {
            console.error('Erro ao buscar relatórios:', error);
            res.status(500).json({ message: 'Houve um erro ao buscar os relatórios', error });
        }
    }

    async getAllReportsSigned(req, res) {
        try {
            const mongo = MongoDB.getInstance();
            await mongo.connect();
            const db = mongoose.connection;
    
            const collection = db.collection('signed_pdfs');
            const hasFilters = Object.keys(req.query).length > 0;
    
            if (hasFilters) {
                const { documentId } = req.query;
    
                if (!mongoose.Types.ObjectId.isValid(documentId)) {
                    return res.status(400).json({ message: 'ID inválido' });
                }
    
                const document = await collection.findOne({ _id: new mongoose.Types.ObjectId(documentId) });
    
                if (!document) {
                    return res.status(404).json({ message: 'Documento não encontrado' });
                }

                if (document.pdfBuffer) {
                    document.pdfBytes = Array.from(new Uint8Array(document.pdfBuffer.buffer));
                } else {
                    document.pdfBytes = [];
                }

                return res.json(document);
            } else {
                const documents = await collection.find().toArray();
                return res.json(documents);
            }
        } catch (error) {
            console.error('Erro ao buscar relatórios assinados:', error);
            return res.status(500).json({ message: 'Erro ao buscar relatórios assinados' });
        }
    }

    async createReport(req, res) {

        try {
            const mongo = MongoDB.getInstance();
            await mongo.connect();
            const db = mongoose.connection;

            const collection = db.collection('pdfs');

            const newReport = {
                name: req.body.name || req.file.originalname,
                file: req.files.file.data,
                fileType: req.files.file.mimetype
            };

            const result = await collection.insertOne(newReport);

            res.status(201).json({ message: 'Relatório criado com sucesso', reportId: result.insertedId });
        } catch (error) {
            console.error('Erro ao criar relatório:', error);
            res.status(500).json({ message: 'Houve um erro ao criar o relatório', error });
        }
    }

    async deleteReport(req, res) {
        try {
            const mongo = MongoDB.getInstance();
            await mongo.connect();
            const db = mongoose.connection;

            const collection = db.collection('pdfs');

            const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Relatório não encontrado' });
            }

            res.status(200).json({ message: 'Relatório deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar relatório:', error);
            res.status(500).json({ message: 'Houve um erro ao deletar o relatório', error });
        }
    }
}