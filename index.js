const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { updateUser, findUserById, findUserByEmail } = require('./db'); // Certifique-se de que a função findUserByEmail está importada
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Middleware de autenticação de token JWT
function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Token não fornecido');
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Token inválido');
        }
        req.user = user; // Adiciona o usuário decodificado ao objeto req
        next();
    });
}

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verificação de credenciais e geração do token JWT
        const user = await findUserByEmail(email);

        if (!user || !bcrypt.compareSync(password, user.senha)) {
            return res.status(401).send('Email ou senha incorretos');
        }

        const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.TOKEN_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/tela-principal');
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).send('Erro no servidor ao fazer login');
    }
});

// Rota de Atualização (GET)
app.get('/atualizar', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'atualizar', 'atualizar.html'));
});

app.post('/atualizar', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { primeiro_nome, ultimo_nome, email, senha } = req.body;

    try {
        // Atualiza os dados do usuário no banco de dados
        const updatedUser = await updateUser(userId, { primeiro_nome, ultimo_nome, email, senha });
        if (!updatedUser) {
            return res.status(404).send('Usuário não encontrado');
        }
        // Redireciona de volta à página de atualização com mensagem de sucesso
        res.redirect('/atualizar?updated=true');
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        res.status(500).send('Erro ao atualizar dados do usuário');
    }
});

app.get('/tela-principal', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'tela-principal', 'tela-principal.html'));
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
