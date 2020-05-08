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
    const { firstname, lastname, areacode, telnum, email, feedback } = req.body;

    if (!firstname || !lastname) {
        const error = '401: Please provide your name!';
        res.status(401).json({ error: error });
        return;
    }

    if (!areacode || !telnum) {
        const error = '401: Please provide your contact phone number!';
        res.status(401).json({ error: error });
        return;
    }

    if (!email) {
        const error = '401: Please provide your email!';
        res.status(401).json({ error: error });
        return;
    }

    // if (!isEmail(emailid)) {
    //     const error = '401: Please provide a valid email!';
    //     res.status(401).json({ error: error });
    //     return;
    // }

    if (!feedback) {
        const error = '401: Please provide your feedbacks!';
        res.status(401).json({ error: error });
        return;
    }

    try {
        const newFeedback = await feedbacks.addFeedback(xss(firstname), xss(lastname), xss(areacode), xss(telnum), xss(email), xss(feedback));
        res.status(200).json(newFeedback);

    } catch (e) {
        res.status(500).json({ error: e });
    }

});

// function isEmail(email) {
//     var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//     return regex.test(email);
// }

module.exports = router;