const express = require('express');
const db = require('../controllers/articleController');

const router = express.Router();

router.get('/', db.getAllArticles);
router.get('/:id', db.getArticle);
// router.post('/', db.addSpecies);

module.exports = router;
