const express = require('express');
const partyController = require('../controllers/partyController');

const router = express.Router();

router.delete('/', partyController.party_delete);
router.get('/create', partyController.party_create);
router.get('/playlist', partyController.party_playlist);
router.post('/add', partyController.party_add_post);


module.exports = router;