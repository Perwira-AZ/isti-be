const { get } = require('http');

require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

const getAllTree = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tree');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getTree = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tree WHERE id = ?', [
      req.params.id,
    ]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getLocation = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT long_lat, status FROM tree WHERE species_id = ?',
      [req.params.id]
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

const addTree = async (req, res) => {
  try {
    const { species_id, long_lat, ip_id, height, circumference } = req.body;
    const [result] = await pool.query(
      'INSERT INTO tree (species_id, long_lat, ip_id, height, circumference) VALUES (?, ?, ?, ?, ?)',
      [species_id, long_lat, ip_id, height, circumference]
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getAllTree,
  getTree,
  getLocation,
  addTree,
};
