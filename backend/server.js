const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      `INSERT INTO users (name, email) VALUES ('${name}', '${email}') RETURNING *`
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const result = await pool.query(
      `UPDATE users SET name = '${name}', email = '${email}' WHERE id = ${id} RETURNING *`
    );
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
    res.send('User deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});