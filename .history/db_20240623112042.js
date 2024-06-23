require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

//-----------------usuario-------------------------------
const createUser = async ({ username, email, senha }) => {
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Verifica se o username já existe
    const usernameExists = await checkIfUsernameExists(username);
    if (usernameExists) {
        throw new Error('Username já está em uso');
    }

    // Verifica se o email já existe
    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
        throw new Error('Email já está em uso');
    }

    const query = 'INSERT INTO tbl_usuario (username, email, senha) VALUES ($1, $2, $3) RETURNING *';
    const values = [username, email, hashedPassword];

    try {
        const { rows } = await pool.query(query, values);
        await logAtividade(rows[0].user_id, 'Usuário criado');
        return rows[0];
    } catch (error) {
        throw error;
    }
};
const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM tbl_Usuario WHERE email = $1';
    const values = [email];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        throw error;
    }
};
const findUserById = async (id) => {
    const query = 'SELECT * FROM tbl_Usuario WHERE user_id = $1';
    const values = [id];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        throw error;
    }
};
const updateUser = async (id, { username, email, senha }) => {
  const hashedPassword = await bcrypt.hash(senha, 10);

  try {
      const query = 'UPDATE tbl_usuario SET username = $1, email = $2, senha = $3 WHERE user_id = $4 RETURNING *';
      const values = [username, email, hashedPassword, id];
      const { rows } = await pool.query(query, values);
      await logAtividade(id, 'Usuário atualizado');
      return rows[0];
  } catch (error) {
      throw error;
  }
};
const deleteUser = async (id) => {
  const query = 'DELETE FROM tbl_Usuario WHERE user_id = $1 RETURNING *';
  const values = [id];

  try {
      const { rows } = await pool.query(query, values);
      return rows[0];
  } catch (error) {
      throw error;
  }
};
const checkIfUsernameExists = async (username) => {
    const query = 'SELECT * FROM tbl_Usuario WHERE username = $1';
    const values = [username];

    try {
        const { rows } = await pool.query(query, values);
        return rows.length > 0;
    } catch (error) {
        throw error;
    }
};
const checkIfEmailExists = async (email) => {
    const query = 'SELECT * FROM tbl_Usuario WHERE email = $1';
    const values = [email];

    try {
        const { rows } = await pool.query(query, values);
        return rows.length > 0;
    } catch (error) {
        throw error;
    }
};
//----------------contrato---------------------------
const createContracto = async (id_user, titulo, contratante, contratado) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Criar o contrato
        const contratoQuery = 'INSERT INTO tbl_contrato (id_user, titulo) VALUES ($1, $2) RETURNING contrato_id';
        const contratoValues = [id_user, titulo];
        const { rows: contratoRows } = await client.query(contratoQuery, contratoValues);
        const contratoId = contratoRows[0].contrato_id;

        // Adicionar ou atualizar contratante
        const contratanteQuery = 'INSERT INTO tbl_contratante (nome, nif, endereco) VALUES ($1, $2, $3) RETURNING contratante_id';
        const contratanteValues = [contratante.nome, contratante.nif, contratante.endereco];
        const { rows: contratanteRows } = await client.query(contratanteQuery, contratanteValues);
        const contratanteId = contratanteRows[0].contratante_id;

        // Adicionar ou atualizar contratado
        const contratadoQuery = 'INSERT INTO tbl_contratado (nome, nif, endereco) VALUES ($1, $2, $3) RETURNING contratado_id';
        const contratadoValues = [contratado.nome, contratado.nif, contratado.endereco];
        const { rows: contratadoRows } = await client.query(contratadoQuery, contratadoValues);
        const contratadoId = contratadoRows[0].contratado_id;

        // Relacionar contrato com contratante e contratado
        const partesQuery = 'INSERT INTO tbl_contrato_partes (contrato_id, contratante_id, contratado_id) VALUES ($1, $2, $3)';
        const partesValues = [contratoId, contratanteId, contratadoId];
        await client.query(partesQuery, partesValues);

        await client.query('COMMIT');
        await logAtividade(id_user, `Contrato criado: ${titulo}`);
        return { contratoId, contratanteId, contratadoId };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
// Importe o pool configurado para se conectar ao banco de dados
const pool = require('./db'); // O arquivo onde você configurou o pool

const listContratosByUserId = async (userId) => {
    try {
        const query = 'SELECT * FROM tbl_contrato WHERE id_user = $1';
        const { rows } = await pool.query(query, [userId]);
        return rows;
    } catch (error) {
        throw error;
    }
};

module.exports = { listContratosByUserId };

const updateContrato = async (userId, contratoId, titulo) => {
    try {
        const query = 'UPDATE tbl_contrato SET titulo = $1 WHERE contrato_id = $2 AND id_user = $3 RETURNING *';
        const { rows } = await pool.query(query, [titulo, contratoId, userId]);
        await logAtividade(userId, `Contrato atualizado: ${titulo}`);
        return rows[0];
    } catch (error) {
        throw error;
    }
};
const deleteContrato = async (userId, contratoId) => {
    try {
        const query = 'DELETE FROM tbl_contrato WHERE contrato_id = $1 AND id_user = $2 RETURNING *';
        const { rows } = await pool.query(query, [contratoId, userId]);
        await logAtividade(userId, `Contrato deletado: ID ${contratoId}`);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

//----------------log de atividades---------------------------
const logAtividade = async (userId, tipoAtividade) => {
  const query = 'INSERT INTO tbl_logatividade (id_user, tipo_atividade, data_atividade) VALUES ($1, $2, current_timestamp)';
  const values = [userId, tipoAtividade];

  try {
      await pool.query(query, values);
  } catch (error) {
      throw error;
  }
};
const getLogsByUserId = async (userId) => {
  const query = 'SELECT tipo_atividade, data_atividade FROM tbl_logatividade WHERE id_user = $1';
  const values = [userId];

  try {
      const { rows } = await pool.query(query, values);
      return rows;
  } catch (error) {
      throw error;
  }
};
const insertLog = async (id_user, tipo_atividade) => {
  // Verifique se o id_user existe na tabela tbl_usuario
  const userExistsQuery = 'SELECT user_id FROM tbl_usuario WHERE user_id = $1';
  const userExistsValues = [id_user];

  try {
      const { rows } = await pool.query(userExistsQuery, userExistsValues);

      if (rows.length === 0) {
          throw new Error(`Usuário com id ${id_user} não encontrado`);
      }

      // Realize a inserção na tabela tbl_logatividade
      const insertQuery = 'INSERT INTO tbl_logatividade (id_user, tipo_atividade, data_atividade) VALUES ($1, $2, CURRENT_TIMESTAMP)';
      const insertValues = [id_user, tipo_atividade];

      await pool.query(insertQuery, insertValues);
      console.log('Log de atividade inserido com sucesso.');
  } catch (error) {
      console.error('Erro ao inserir log de atividade:', error.message);
      throw error;
  }
};
module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
    deleteUser,
    createContracto,
    listContratosByUserId,
    updateContrato,
    deleteContrato,
    checkIfUsernameExists,
    checkIfEmailExists,
    logAtividade,
    getLogsByUserId,
    insertLog
};
