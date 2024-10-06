const express = require('express');
const app = express();
const pool = require('./db');
const authenticateToken = require('./auth');
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
    const result = await pool.query(`SELECT * FROM users WHERE email = '${email} and password = '${password}'`);
    const user = result.rows[0];
    
    if (!result) {
      return res.status(404).send('User not found');
    }

    if (result) {

      return res.status(200).send('Logado com sucesso');
    }

    if (!user || user.password !== password) {
      return res.status(401).send('Invalid credentials');
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
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

app.get('/api/users/:id', async (req, res) => {
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
    const result = await pool.query(
      `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${password}') RETURNING *`
    );

    if (user.email === email) {

      return res.status(400).send('User already exists');
    }

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
    const result = await pool.query(
      `UPDATE users SET name = '${name}', email = '${email}' WHERE id = ${id} RETURNING *`
    );

    if (user.email === email) {

      return res.status(400).send('User already exists');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM users WHERE id = ${id}`);

    res.status(200).send('User deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});