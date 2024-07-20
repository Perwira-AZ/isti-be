require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

const getAllArticles = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM article');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getArticle = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM article WHERE id = ?', [
      req.params.id,
    ]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

// const addSpecies = async (req, res) => {
//   try {
//     const { iucn_status, compatibility, habitat, scientific_name, potency } =
//       req.body;
//     const [result] = await pool.query(
//       'INSERT INTO species (iucn_status, compatibility, habitat, scientific_name, potency) VALUES (?, ?, ?, ?, ?)',
//       [iucn_status, compatibility, habitat, scientific_name, potency]
//     );
//     res.status(201).json(result);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

module.exports = {
  getAllArticles,
  getArticle,
};
