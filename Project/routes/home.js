const express = require('express');
const router = express.Router();
const data = require('../data/users');
const bcrypt = require('bcryptjs');

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
        let curUser = await data.getUserByEmail(email);

        if (!curUser) {
            const error = '401: User not found! You must provide a valid user email!';
            res.status(401).json({ error: error });
            return;
        }

        let match = await bcrypt.compare(password, curUser.hashedPassword);

        if (!match) {
            const error = '401: Password not correct! You must provide a valid password!';
            res.status(401).json({ error: error });
            return;
        }

        req.session.AuthCookie = curUser;

    } catch (e) {
        res.status(500).json({ error: e });
    }

});

router.post('/signUp', async (req, res) => {

    const { email, password, confirmedPassword } = req.body;
    if (!email || !password) {
        const error = "401: you must provide the email and the password!";
        res.status(401).json({ error: error });
    }
    if (password !== confirmedPassword) {
        const error = "401 : the password and the confirmed password is not the same!";
        res.status(401).json({ error: error });
    }
    let hashedPassword = bcrypt.hash(password, saltRound);
    try {
        let user = await data.getUserByEmail(email);
        if (user !== null) {
            const error = "401: the user has existed";
            res.status(401).json({ error: error });
            return;
        }
        else {

            let NewUser = {
                firstName: "",
                lastName: "",
                Email: email,
                Address: "",
                contanctNumber: "",
                hashedPassword: hashedPassword
            };
            await data.addUser("", "", email, "", "", hashedPassword);
            req.session.AuthCookie = user;
            return;
        }


    } catch (e) {
        res.status(500).json({ error: e });
        return;
    }

})


router.get('/logout', async (req, res) => {
    try {
        res.clearCookie("AuthCookie");
        req.session.destroy();
        res.status(200).json({ message: 'Logout successfully!' });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/logout', async(req, res) => {
    try {
        res.clearCookie("AuthCookie");
        req.session.destroy();
        res.status(200).json({ message: 'Logout successfully!' });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get('/menu', async(req, res) => {
    if (req.session.user) {
        res.redirect('/menu');
        return;
    } else {
        res.render('login/error', { layout: false });
    }
});

router.get('/users', async(req, res) => {
    if (req.session.user) {
        res.redirect('/users');
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