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

// Função para criar um novo usuário
const createUser = async ({ primeiro_nome, ultimo_nome, email, senha }) => {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const query = 'INSERT INTO tbl_Usuario (primeiro_nome, ultimo_nome, email, senha) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [primeiro_nome, ultimo_nome, email, hashedPassword];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        throw error;
    }
};
// Função para encontrar um usuário pelo email
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
// Função para encontrar um usuário pelo ID
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
// Função para atualizar informações do usuário
const updateUser = async (id, { primeiro_nome, ultimo_nome, email, senha }) => {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const query = 'UPDATE tbl_Usuario SET primeiro_nome = $1, ultimo_nome = $2, email = $3, senha = $4 WHERE user_id = $5 RETURNING *';
    const values = [primeiro_nome, ultimo_nome, email, hashedPassword, id];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        throw error;
    }
};
// Função para deletar um usuário
const deleteUser = async (id) => {
  const query = 'DELETE FROM tbl_Usuario WHERE user_id = $1';

  try {
    await pool.query(query, [id]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
    deleteUser
};

