User
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar o middleware body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conectar ao banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cadastro'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err.message);
    } else {
        console.log('Conexão bem-sucedida com o banco de dados MySQL');
    }
});

// Rotas CRUD

// Criar um item
app.post('/items', (req, res) => {
    const name = req.body.name;
    db.query("INSERT INTO items (name) VALUES (?)", name, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Item criado com sucesso', id: result.insertId });
    });
});

// Ler todos os itens
app.get('/items', (req, res) => {
    db.query("SELECT * FROM items", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// Atualizar um item
app.put('/items/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    db.query("UPDATE items SET name = ? WHERE id = ?", [name, id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Item atualizado com sucesso' });
    });
});

// Excluir um item
app.delete('/items/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM items WHERE id = ?", id, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Item excluído com sucesso' });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});