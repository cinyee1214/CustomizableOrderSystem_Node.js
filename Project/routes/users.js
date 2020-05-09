const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require('../data');
const userData = data.users;

router.get('/', async(req, res) => {
    if (req.session.AuthCookie) {
        res.render('restaurant/userOrder', { layout: false });
        return;
    } else {
        res.render('login/error', { layout: false });
    }
});

router.get('/logout', async(req, res) => {
    try {
        res.clearCookie("AuthCookie");

        res.cookie('user', '');
        res.clearCookie('user');

        res.cookie('cos', '');
        res.clearCookie('cos');

        res.cookie('hotpot', '');
        res.clearCookie('hotpot');

        req.session.destroy();

        res.render('login/logout', { layout: false });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});


router.post('/', async (req, res) =>{

    const { firstname, lastname, emailid, passwordid, cpasswordid, telnum, address } = req.body;
    if (!emailid || !passwordid || !cpasswordid) {
        const error = "401: you must provide the email and the password!";
        res.status(401).json({ error: error });
        return;
    }
    if (passwordid !== cpasswordid) {
        const error = "401 : the password and the confirmed password are not the same!";
        res.status(401).json({ error: error });
        return;
    }


    try {
        let user = await userData.getUserByEmail(xss(emailid));
        if (user !== null && user.Email !== req.session.AuthCookie.Email) {
            const error = "401: The user already existed, please signin.";
            res.status(401).json({ error: error });
            return;
        } else {
            const updatedUser = await userData.updateUser(req.session.AuthCookie._id, xss(firstname), xss(lastname), xss(emailid), xss(address), xss(telnum), xss(passwordid));
            res.status(200).json("update completed!");
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }


});


router.delete('/:id', async(req, res) => {
    if (!req.params.id) {
        throw 'You must provide a user_ID to delete.';
    }

    try {
        await userData.getUserById(req.params.id);
        const deletedUser = await userData.removeUser(req.params.id);
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});


module.exports = router;