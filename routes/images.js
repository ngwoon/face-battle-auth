const express = require('express');
const router = express.Router();

router.post('/', function(req, res, next) {
    res.render("index");
});

module.exports = router;