const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router
    .route('/groups')
    .get(groupController.getAllGroup);

module.exports = router;