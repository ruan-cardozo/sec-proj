import { pool } from '../../../../config/db.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class LoginService {

    static #instance;

    static getInstance() {
            
        if (!LoginService.#instance) {
    
            LoginService.#instance = new LoginService();
        }
    
        return LoginService.#instance;
    }

    async login(req, res) {
       
        try {
            const { email, password } = req.body;
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {

                return res.status(404).send('User not found');
            }

            const userIsValid = await bcrypt.compare(password, user.password);

            if (userIsValid) {

                const accessToken = jwt.sign(
                    { id: user.id, email: user.email },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '8h' }
                );

                res.cookie('authToken', accessToken, { httpOnly: true,  sameSite: 'strict', secure: true, expiresIn: 60 * 60 * 8 * 1000 });
                res.cookie('userId', user.id, { httpOnly: true,  sameSite: 'strict', secure: true, expiresIn: 60 * 60 * 8 * 1000 });
                return res.json({ accessToken, userId: user.id });
            } else {
                return res.status(401).send('Invalid credentials');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    }
}