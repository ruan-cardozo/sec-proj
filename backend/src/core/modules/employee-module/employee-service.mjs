import { MongoDB } from '../../../config/mongo.mjs';
import mongoose from 'mongoose';

export class EmployeeService {

    static #instance;

    static getInstance() {

        if (!EmployeeService.#instance) {

            EmployeeService.#instance = new EmployeeService();
        }

        return EmployeeService.#instance;
    }

    async getAllEmployees(req, res) {
        try {
            const mongo = MongoDB.getInstance();
            mongo.connect();
            const db = mongoose.connection;
            const collection = db.collection('employees');
            const result = await collection.find().toArray();
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Houve um erro ao buscar os colaboradores', error });
        }
    }

    async getOneEmployee(req, res) {
        try {
            const { id } = req.params;
            console.log(req.params);
            const mongo = MongoDB.getInstance();
            mongo.connect();
            const db = mongoose.connection;
            const collection = db.collection('employees');
            const result = await collection.findOne({ _id: new mongoose.Types.ObjectId(id) });
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Houve um erro ao buscar o colaborador', error });
        }
    }

    async createEmployee(req, res) {

        try {
            const { name, position, department, salary, hireDate } = req.body;
            const mongo = MongoDB.getInstance();
            mongo.connect();
            const db = mongoose.connection;
            const collection = db.collection('employees');
            const result = await collection.insertOne({ name, position, department, salary, hireDate });
            res.status(201).json({ message: 'Colaborador criado com sucesso', employeeId: result.insertedId });
        } catch (error) {
            res.status(500).json({ message: 'Houve um erro ao criar o colaborador', error });
        }
    }

    async updateEmployee(req, res) {
        try {
            const { id } = req.params;
            const { name, position, department, salary, hireDate } = req.body;
            const mongo = MongoDB.getInstance();
            mongo.connect();
            const db = mongoose.connection;
            const collection = db.collection('employees');
            const result = await collection.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: { name, position, department, salary, hireDate } });

            if (result.acknowledged) {

                const updatedEmployee = await collection.findOne({ _id: new mongoose.Types.ObjectId(id) });
                res.json({ message: 'Colaborador atualizado com sucesso', employee: updatedEmployee });
            }

        } catch (error) {
            res.status(500).json({ message: 'Houve um erro ao atualizar o colaborador', error });
        }
    }

    async deleteEmployee(req, res) {
        try {
            const { id } = req.params;
            const mongo = MongoDB.getInstance();
            mongo.connect();
            const db = mongoose.connection;
            const collection = db.collection('employees');
            const result = await collection.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

            if (result.deletedCount) {
                res.json({ message: 'Colaborador deletado com sucesso' });
            } else {
                res.status(404).json({ message: 'Colaborador não encontrado' });
            }

        } catch (error) {
            res.status(500).json({ message: 'Houve um erro ao deletar o colaborador', error });
        }
    }
}