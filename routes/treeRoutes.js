const express = require('express');
const db = require('../controllers/treeControllers');

const router = express.Router();

router.get('/', db.getAllTree);
router.get('/:id', db.getTree);
router.get('/location/:id', db.getLocation);
router.post('/', db.addTree);

module.exports = router;
