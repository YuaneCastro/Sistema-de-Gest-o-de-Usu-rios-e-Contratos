const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, updateUser, findUserByEmail, deleteUser } = require('./db');
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

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'cadastro', 'cadastro.html'));
});
app.post('/cadastro', async (req, res) => {
  const { primeiro_nome, ultimo_nome, email, senha } = req.body;

  try {
      const newUser = await createUser({ primeiro_nome, ultimo_nome, email, senha });
      if (!newUser) {
          return res.status(400).send('Erro ao cadastrar usuário');
      }
      res.redirect('/login');
  } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      res.status(500).send('Erro no servidor ao cadastrar usuário');
  }
});

app.get('/configuracoes', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'configuracoes', 'configuracoes.html'));
});
app.post('/configuracoes', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { primeiro_nome, ultimo_nome, email, senha } = req.body;

  try {
    const updatedUser = await updateUser(userId, { primeiro_nome, ultimo_nome, email, senha });
    if (!updatedUser) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.redirect('/configuracoes?updated=true');
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    res.status(500).send('Erro ao atualizar dados do usuário');
  }
});

app.post('/delete', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    await deleteUser(userId);
    res.clearCookie('token');
    res.redirect('/login');
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).send('Erro ao deletar usuário');
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
