const router                    = express.Router();
const express                   = require('express');
const registrationController    = require("../controllers/registration-controller");

router.post('/', registrationController.registrateUser);
router.post("/check/email", registrationController.checkEmailDuplication);

module.exports = router;
