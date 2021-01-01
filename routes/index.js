var express = require('express');
var router = express.Router();
const path = require("path");
const db = require("../models");

/* GET home page. */
router.get('/', async function(req, res, next) {
  const result = await db.question.findAll();

  titles = []
  for(let row of result)
    titles.push(row.title);

  res.render("index", { "titles": titles });
});

module.exports = router;
