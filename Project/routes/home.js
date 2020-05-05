const express = require('express');
const router = express.Router();
const data = require('../data/users');
const bcrypt = require('bcryptjs');

router.get('/', async(req, res) => {
    res.sendFile(path.resolve('public/index.html'));
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



router.get('/logout', async(req, res) => {
    try {
        res.clearCookie("AuthCookie");
        req.session.destroy();
        res.status(200).json({ message: 'Logout successfully!' });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


module.exports = router;