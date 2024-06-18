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

  const query = 'INSERT INTO tbl_Usuario (username, email, senha) VALUES ($1, $2, $3) RETURNING *';
  const values = [username, email, hashedPassword];

  try {
      const { rows } = await pool.query(query, values);
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

  // Verifica se o username já existe, exceto para o próprio usuário sendo atualizado
  const usernameExists = await checkIfUsernameExists(username);
  if (usernameExists && !(await findUserById(id)).username === username) {
      throw new Error('Username já está em uso');
  }

  // Verifica se o email já existe, exceto para o próprio usuário sendo atualizado
  const emailExists = await checkIfEmailExists(email);
  if (emailExists && !(await findUserById(id)).email === email) {
      throw new Error('Email já está em uso');
  }

  const query = 'UPDATE tbl_Usuario SET username = $1, email = $2, senha = $3 WHERE user_id = $4 RETURNING *';
  const values = [username, email, hashedPassword, id];

  try {
      const { rows } = await pool.query(query, values);
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
const createContracto = async (id_user, titulo) => {
  const query = 'INSERT INTO tbl_contrato (id_user, titulo) VALUES ($1, $2) RETURNING *';
  const values = [id_user, titulo];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};
const listContratosByUserId = async (userId) => {
  try {
      const query = 'SELECT * FROM tbl_contrato WHERE id_user = $1';
      const { rows } = await pool.query(query, [userId]);
      return rows;
  } catch (error) {
      throw error;
  }
};
const updateContrato = async (userId, contratoId, titulo) => {
  try {
      const query = 'UPDATE tbl_contrato SET titulo = $1 WHERE contrato_id = $2 AND id_user = $3 RETURNING *';
      const { rows } = await pool.query(query, [titulo, contratoId, userId]);
      return rows[0];
  } catch (error) {
      throw error;
  }
};
const deleteContrato = async (userId, contratoId) => {
  try {
      const query = 'DELETE FROM tbl_contrato WHERE contrato_id = $1 AND id_user = $2 RETURNING *';
      const { rows } = await pool.query(query, [contratoId, userId]);
      return rows[0];
  } catch (error) {
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
    checkIfEmailExists
};

