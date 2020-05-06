const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require('../data');
const userData = data.users;

router.get('/', async(req, res) => {
    res.render('restaurant/menu', { layout: false });
});

module.exports = router;