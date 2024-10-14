const express = require('express');
const app = express();
const pool = require('./db');
const authenticateToken = require('./auth');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

const corsOptions = {
	origin: 'http://localhost:5173',
}

app.use(cors(corsOptions));
app.use(express.json());

app.listen(3000, () => {
	console.log('Server started on port 3000');
});

app.post('/api/login', async (req, res) => {
	const { email, password } = req.body;

	try {

		const result = await pool.query(`SELECT * FROM users WHERE email = $1  and password = $2`, [email, password]);
		const user = result.rows[0];
		
		if (!result) {
			return res.status(404).send('User not found');
		}

		const userIsValid = Boolean(bcrypt.compare(password, user.password));

		console.log({userIsValid});

		if (userIsValid) {
			const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

			res.json({ accessToken, userId: user.id });
		}

		return res.status(401).send('Invalid credentials');
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

app.get('/api/users', authenticateToken, async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM users');

		if (!result) {

			return res.status(404).send('No users found');
		}

		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

app.get('/api/users/:id',authenticateToken, async (req, res) => {
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
});

app.post('/api/users', async (req, res) => {
	try {
		let { name, email, password } = req.body;

		const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
		
		if (user.email === email) {
		
			return res.status(400).send('User already exists');
		}

		password = encryptPassword(password);

		const result = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [name, email, password]);

		res.status(201).json(result.rows[0]);

	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
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
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;

		await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

		res.status(200).send('User deleted');
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});


function encryptPassword(password) {

	return bcrypt.hashSync(password, 10);
}