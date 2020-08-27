const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.get('/:id', homeController.home_index);

module.exports = router;