const express = require('express');
const db = require('../controllers/speciesControllers');

const router = express.Router();

router.get('/search', db.searchSpecies);
router.get('/', db.getAllSpecies);
router.get('/:id', db.getSpecies);
router.post('/', db.addSpecies);

module.exports = router;
