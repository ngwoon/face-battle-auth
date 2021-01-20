const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render("index");
});

router.get("/callback", function(req, res, next) {
    console.log("callback");
    res.render("callback");
});

module.exports = router;
