const express = require('express');
const router = express.Router();

router.post('/email', function(req, res, next) {
    const email = req.body.email;

    res.send('respond with a resource');
});

module.exports = router;
