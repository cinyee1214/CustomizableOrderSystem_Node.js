const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require('../data');
const feedbacks = data.feedbacks;

router.get('/', async(req, res) => {
    res.render('restaurant/contactus', { layout: false });
});

router.post('/feedback', async(req, res) => {
    const { firstname, lastname, areacode, telnum, emailid, feedback } = req.body;

    if (!firstname || !lastname) {
        const error = '401: Please provide your name!';
        res.status(401).json({ error: error });
        return;
    }

    if ((!areacode || !telnum) && !emailid) {
        const error = '401: Please provide your contact phone number or email!';
        res.status(401).json({ error: error });
        return;
    }

    if (!feedback) {
        const error = '401: Please provide your feedbacks!';
        res.status(401).json({ error: error });
        return;
    }

    try {
        const newFeedback = await feedbacks.addFeedback(firstname, lastname, areacode, telnum, emailid, feedback);
        res.status(200).json(newFeedback);

    } catch (e) {
        res.status(500).json({ error: e });
    }

});

module.exports = router;