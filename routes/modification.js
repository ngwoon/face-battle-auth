const express = require('express');
const router = express.Router();
const modificationController = require("../controllers/modification-controller");

router.patch('/', modificationController.modifyPassword);

module.exports = router;
