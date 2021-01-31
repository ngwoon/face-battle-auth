const express                   = require('express');
const router                    = express.Router();
const verificationController    = require("../controllers/verification-controller");
const { authenticateUser }      = require("../middlewares/auth"); 

router.post("/code", verificationController.sendVerificationEmail);
router.post('/email', verificationController.verifyEmail);
router.post("/password", authenticateUser, verificationController.verifyPassword);

module.exports = router;
