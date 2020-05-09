const express = require('express');
const router = express.Router();
const data = require('../data/users');
const bcrypt = require('bcryptjs');
const xss = require("xss");

router.get('/', async(req, res) => {
    res.render('restaurant/index', { layout: false });
});


router.post('/login', async(req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        const error = '401: You must provide an email and a password!';
        res.status(401).json({ error: error });
        return;
    }

    try {
        let curUser = await data.getUserByEmail(xss(email));

        // console.log(curUser);

        if (!curUser) {
            const error = '401: User not found! You must provide a valid user email!';
            res.status(401).json({ error: error });
            return;
        }

        let match = await bcrypt.compare(
            xss(password),
            xss(curUser.hashedPassword)
        );

        if (!match) {
            const error = '401: Password not correct! You must provide a valid password!';
            res.status(401).json({ error: error });
            return;
        }

        let sessionUser = { _id: curUser._id, email: xss(curUser.Email) };

        res.cookie('user', JSON.stringify(sessionUser));

        req.session.AuthCookie = curUser;
        res.status(200).json(curUser);

    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/signup', async(req, res) => {

    const { email, password, confirmedPassword } = req.body;
    if (!email || !password || !confirmedPassword) {
        const error = "401: you must provide the email and the password!";
        res.status(401).json({ error: error });
    }
    if (password !== confirmedPassword) {
        const error = "401 : the password and the confirmed password are not the same!";
        res.status(401).json({ error: error });
    }

    try {
        let user = await data.getUserByEmail(xss(email));
        if (user !== null) {
            const error = "401: The user already existed, please signin.";
            res.status(401).json({ error: error });
            return;
        } else {
            const NewUser = await data.addUser("", "", xss(email), "", "", xss(password));
            res.status(200).json(NewUser);
        }
    } catch (e) {
        // res.status(500).json({ error: "SignUp failed." });
        res.status(500).json({ error: e });
    }
});


router.get('/menu', async(req, res) => {
    if (req.session.AuthCookie) {
        res.render('restaurant/menu', { layout: false });
        return;
    } else {
        res.render('login/error', { layout: false });
    }
});

router.get('/users', async(req, res) => {
    if (req.session.AuthCookie) {
        res.render('restaurant/userOrder', { layout: false, user: req.session.AuthCookie });
        return;
    } else {
        res.render('login/error', { layout: false });
    }
});

router.get('/about', async(req, res) => {
    res.render('restaurant/aboutus', { layout: false });
});

router.get('/contact', async(req, res) => {
    res.render('restaurant/contactus', { layout: false });
});

module.exports = router;