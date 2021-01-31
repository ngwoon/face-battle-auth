const express               = require("express");
const router                = express.Router();
const withdrawalController  = require("../controllers/withdrawal-controller");

router.post("/", withdrawalController.withdraw);

module.exports = router;