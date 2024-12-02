import { pool } from '../../../config/db.mjs';
import { encryptPassword } from '../../../common/helper/password-encrypt-helper.mjs';

export class UserController {

    static #instance;

    static getInstance() {
        
        if (!UserController.#instance) {

            UserController.#instance = new UserController();
        }

        return UserController.#instance;
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
    
            const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    
            if (!result) {
                return res.status(404).send('User not found');
            }
    
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }

    async getAllUsers(req, res) {
        try {
            const result = await pool.query('SELECT * FROM users');
    
            if (!result) {
                return res.status(404).send('Nenhum usuário encontrado');
            }
    
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).send('Ocorreu um erro ao buscar os usuários');
        }
    }

    async createUser(req, res) {
        
        try {
            let { name, email, password } = req.body;
    
            const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
            
            if (user.email === email) {

                return res.status(400).send('Já existe um usuário com este e-mail');
            }
    
            password = encryptPassword(password);
    
            const result = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [name, email, password]);
    
            res.status(201).json({ message: "O usuário foi criado com sucesso", user: result.rows[0] });

        } catch (err) {
            console.error(err);
            res.status(500).send('Ocorreu um erro ao criar o usuário', err);
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { email, name, password } = req.body;
    
            const userQuery = `SELECT * FROM users WHERE id = $1`;
            const databaseUser = await pool.query(userQuery, [id]);
            const user = databaseUser.rows[0];
            const userUpdateQuery = `UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`;
            const result = await pool.query(userUpdateQuery, [name, email, password, user.id]);
    
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
    
            await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    
            res.status(200).send('User deleted');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
}