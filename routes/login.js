const express           = require('express');
const router            = express.Router();
const authController    = require("../controllers/auth-controller");

router.post('/normal', authController.normalLogIn);
router.post("/oauth", authController.socialLogIn);

module.exports = router;
