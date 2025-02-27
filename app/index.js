const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        process.exit(1);
    }
    console.log('Conectado ao MySQL');
});

app.get('/', (req, res) => {
    const name = `User-${Math.floor(Math.random() * 1000)}`;

    db.query('INSERT INTO people (name) VALUES (?)', [name], err => {
        if (err) {
            console.error('Erro ao inserir no banco:', err);
            return res.status(500).send('Erro ao salvar no banco.');
        }

        db.query('SELECT name FROM people', (err, results) => {
            if (err) {
                console.error('Erro ao buscar do banco:', err);
                return res.status(500).send('Erro ao buscar do banco.');
            }

            const namesList = results.map(row => `<li>${row.name}</li>`).join('');
            res.send(`<h1>Full Cycle Rocks!</h1><ul>${namesList}</ul>`);
        });
    });
});

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});
