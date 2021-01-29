const express = require('express');
const router = express.Router();
const findController = require("../controllers/find-controller");

router.post('/email', findController.findEmail);
router.post('/password', findController.findPassword);

module.exports = router;
