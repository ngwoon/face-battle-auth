const express = require("express");
const router = express.Router();
const signOutController = require("../controllers/signout-controller");

router.post("/", signOutController.signOut);

module.exports = router;