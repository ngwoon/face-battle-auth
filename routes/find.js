const express = require('express');
const db = require("../models");
const router = express.Router();

router.post('/', function(req, res, next) {
  res.json({
    item: "hello",
  });
});

module.exports = router;
