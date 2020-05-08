const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require('../data');
const MenuData = data.dishes;
const HotpotData = data.hotpots;
// const finishedMenu = data.finishedDishes;

router.get('/', async(req, res) => {
    if (req.session.AuthCookie) {
        res.render('restaurant/menu', { layout: false });
        return;
    } else {
        res.render('login/error', { layout: false });
    }
});

router.get('/logout', async(req, res) => {
    if (!req.session.AuthCookie) {
        res.render('login/error', { layout: false });
        return;
    }

    try {
        res.clearCookie("AuthCookie");

        res.cookie('user', '');
        res.clearCookie('user');

        req.session.destroy();

        res.render('login/logout', { layout: false });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/customize', async(req, res) => {
    if (!req.session.AuthCookie) {
        res.render('login/error', { layout: false });
        return;
    }

    const { vegetable, meat, cookingstyle, flavor, carbohydrate, drink } = req.body;

    if (!vegetable || !meat || !cookingstyle || !flavor || !carbohydrate || !drink) {
        const error = "401: you must provide all the ingredients!";
        res.status(401).json({ error: error });
        return;
    }

    try {
        const curUser = req.session.AuthCookie;

        let product = `${cookingstyle} ${flavor} ${meat} with ${vegetable} serving with ${carbohydrate} and ${drink}`;
        let newDish = await MenuData.addDish(curUser._id, xss(vegetable), xss(meat), xss(cookingstyle), xss(flavor), xss(carbohydrate), xss(drink), product);

        if (!newDish) {
            const error = "401 : The dish cannot be served.";
            res.status(401).json({ error: error });
            return;
        }

        let sessionCostomize = { _id: newDish._id };

        res.cookie('cos', JSON.stringify(sessionCostomize));

        res.status(200).json(newDish);
    } catch (e) {

        res.status(500).json({ error: e });
    }

});

router.post('/hotpot', async(req, res) => {
    if (!req.session.AuthCookie) {
        res.render('login/error', { layout: false });
        return;
    }

    const { numOfGuest, section, date } = req.body;
    if (!numOfGuest) {
        const error = "Please provide the number of guests!";
        res.status(401).json({ error: error });
        return;
    }
    if (!section) {
        const error = "Please provide the section!";
        res.status(401).json({ error: error });
        return;
    }
    if (!date) {
        const error = "Please provide the valid date!";
        res.status(401).json({ error: error });
        return;
    }

    try {
        const curuser = req.session.AuthCookie;
        let Hotpot = await HotpotData.addHotpot(curuser._id, xss(numOfGuest), xss(section), xss(date));

        if (Hotpot === null) {
            const error = "The order cannot be submitted";
            res.status(401).json({ error: error });
            return;
        }

        let sessionCostomize = { _id: Hotpot._id };

        res.cookie('hotpot', JSON.stringify(sessionCostomize));

        res.status(200).json(Hotpot);

    } catch (e) {
        res.status(500).json({ error: e });
        return;
    }
});

module.exports = router;


// router.post("/FDishes", async(req, res) => {
//     const { UserID, DishID, product, carbohydrate, drink, comments } = req.body;
//     if (!UserID || !DishID || !product || !carbohydrate || !drink || !comments) {
//         const error = "the final dishes cannot be served";
//         res.status(401).json({ error: error });
//         return;
//     }
//     try {
//         let newFinishedDishes = finishedMenu.addFinishedDish(UserID, dishID, product, carbohydrate, drink, comments);
//         if (newFinishedDishes == null || newFinishedDishes === undefined) {
//             const error = "the finished dishes cannot be served";
//             res.status(401).json({ error: error });
//             return;
//         } else {
//             res.status(200).json(newFinishedDishes);
//             return;
//         }
//     } catch (e) {
//         res.status(500).json({ error: e });
//         return;
//     }
// });





// test Json:
// post: http://localhost:3000/menu/customize
// {
// 	"vegetable": "Tomatao",
//      "meat": "Pork",
//     "cookingstyle": "Stew",
//     "flavor": "Mild",
//     "carbohydrate": "Rice",
//     "drink": "Milk"

// }

// login Json:
// post: http://localhost:3000/login
// {
// 	"email": "admin@gmail.com",
//      "password": "test"
// }