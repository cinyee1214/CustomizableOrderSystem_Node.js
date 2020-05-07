const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require('../data');
const userData = data.users;

router.get('/', async(req, res) => {
    if (req.session.AuthCookie) {
        res.render('restaurant/menu', { layout: false });
        return;
    } else {
        res.render('login/error', { layout: false });
    }
});

router.get('/logout', async(req, res) => {
    try {
        res.clearCookie("AuthCookie");
        req.session.destroy();
        res.render('login/logout', { layout: false });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;