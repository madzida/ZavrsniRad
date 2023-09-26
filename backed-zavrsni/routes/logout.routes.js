const express = require('express');
const router = express.Router();


//nema ulogu
router.get('/', function (req, res, next) {
    res.json(true);
});

module.exports = router;
