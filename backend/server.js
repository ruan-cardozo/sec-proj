const express = require('express');
const app = express();
const pool = require('./db');
const jwt = require('jsonwebtoken');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.listen(3000, () => {
	console.log('Server started on port 3000');
});

app.post('/api/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const result = await pool.query(`SELECT * FROM users WHERE email = '${email}' and password = '${password}'`);
		const user = result.rows[0];

		console.log({user});

		if (!result) {
			return res.status(404).send('User not found');
		}

		if (!user || user.password !== password) {
			return res.status(401).send('Invalid credentials');
		}

		res.status(200).send({
			user: result.rows[0],
		});
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

app.get('/api/users', async (req, res) => {
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

app.get('/api/users/:id',async (req, res) => {
	try {
		const { id } = req.params;

		console.log({id});

		const query = `SELECT * FROM users WHERE id = ${id}`;
	
		console.log({query});

		const result = await pool.query(query);

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
		const { name, email, password } = req.body;

		const user = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
		
		if (user.email === email) {
		
			return res.status(400).send('User already exists');
		}

		const query = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${password}') RETURNING *`;
		const result = await pool.query(query);

		res.status(201).json(result.rows[0]);

	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

app.put('/api/users/:id', async (req, res) => {
	try {
		const { id } = req.params;
		console.log({id});
		const { email, name, password } = req.body;

		const userQuery = `SELECT * FROM users WHERE id = ${id}`;
		const databaseUser = await pool.query(userQuery);
		const user = databaseUser.rows[0];
		const userUpdateQuery = `UPDATE users SET name = '${name}', email = '${email}', password = '${password}' WHERE id = ${user.id} RETURNING *`;
		const result = await pool.query(userUpdateQuery);

		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});

app.delete('/api/users/:id', async (req, res) => {
	try {
		const { id } = req.params;

		await pool.query(`DELETE FROM users WHERE id = ${id}`);

		res.status(200).send('User deleted');
	} catch (err) {
		console.error(err);
		res.status(500).send('Server Error');
	}
});