const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createContracto, listContratosByUserId, updateContrato, deleteContrato, createUser, updateUser, findUserByEmail, deleteUser, getLogsByUserId } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do middleware de sessão
app.use(session({
    secret: 'sua_chave_secreta_aqui',
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname)));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
//--------------------entrada----------------
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login', 'login.html'));
});
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        // Verificação de credenciais e geração do token JWT
        const user = await findUserByEmail(email);

        if (!user || !bcrypt.compareSync(senha, user.senha)) {
            return res.status(401).send('Email ou senha incorretos');
        }

        // Definir userId na sessão
        req.session.userId = user.user_id;

        const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.TOKEN_SECRET);
        res.cookie('token', token, { httpOnly: true });
        res.json({ token }); // Envie o token de volta para o frontend
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).send('Erro no servidor ao fazer login');
    }
});
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'cadastro', 'cadastro.html'));
});
app.post('/cadastro', async (req, res) => {
    const { username, email, senha } = req.body;
    try {
        const newUser = await createUser({ username, email, senha });
        if (!newUser) {
            return res.status(400).send('Erro ao cadastrar usuário');
        }
        res.redirect('/login');
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error.message);
        res.status(500).send(error.message);
    }
});

//--------------tela principal e configuracoes----------------
app.get('/configuracoes', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'configuracoes', 'configuracoes.html'));
});
app.post('/configuracoes', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { username, email } = req.body;
    try {
        const updatedUser = await updateUser(userId, { username, email });
        res.json(updatedUser);
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error.message);
        res.status(500).send(error.message);
    }
});
app.post('/delete', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
      await deleteUser(userId);
      req.session.destroy((err) => {
          if (err) {
              console.error('Erro ao destruir sessão:', err);
              return res.status(500).send('Erro ao encerrar sessão');
          }
          res.clearCookie('token');
          res.redirect('/login');        
      });
  } catch (error) {
      console.error('Erro ao deletar usuário:', error.message);
      res.status(500).send(error.message);
  }
});
app.get('/log-atividades', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(403).json({ error: 'Usuário não autenticado' });
    }

    try {
        const logs = await getLogsByUserId(userId);
        const filteredLogs = logs.map(log => ({
            tipo_atividade: log.tipo_atividade,
            data_atividade: log.data_atividade
        }));
        res.json(filteredLogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/tela-principal', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'tela-principal', 'tela-principal.html'));
});
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

//-------------contrato-------------
app.get('/criar-contrato', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'criar-contrato', 'criar-contrato.html'));
});
app.post('/criar-contrato', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { titulo } = req.body;

  try {
      const newContract = await createContracto(userId, titulo);
      if (!newContract) {
          return res.status(400).send('Erro ao criar contrato');
      }
      res.redirect('/configuracoes');
  } catch (error) {
      console.error('Erro ao criar contrato:', error);
      res.status(500).send('Erro no servidor ao criar contrato');
  }
});
app.get('/listar-contratos', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const contratos = await listContratosByUserId(userId);
        res.status(200).json(contratos);
    } catch (error) {
        console.error('Erro ao listar contratos:', error);
        res.status(500).send('Erro ao listar contratos');
    }
});
app.put('/atualizar-contratos/:contratoId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const contratoId = req.params.contratoId;
  const { titulo } = req.body;

  try {
      const contrato = await updateContrato(userId, contratoId, titulo);
      if (!contrato) {
          return res.status(404).send('Contrato não encontrado');
      }
      res.status(200).json(contrato);
  } catch (error) {
      console.error('Erro ao atualizar contrato:', error);
      res.status(500).send('Erro ao atualizar contrato');
  }
});
app.delete('/deletar-contratos/:contratoId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const contratoId = req.params.contratoId;

  try {
      const contrato = await deleteContrato(userId, contratoId);
      if (!contrato) {
          return res.status(404).send('Contrato não encontrado');
      }
      res.status(204).send();
  } catch (error) {
      console.error('Erro ao deletar contrato:', error);
      res.status(500).send('Erro ao deletar contrato');
  }
});



app.get('/', (req, res) => {
    res.redirect('/login');
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
