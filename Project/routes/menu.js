const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require('../data');
const userData = data.users;
const MenuData = data.dishes;
const finishedMenu = data.finishedDishes;

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

        res.cookie('user', '');
        res.render('login/logout', { layout: false });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/customize', async(req, res) => {
    const { vegetable, meat, cookingstyle, flavor, carbohydrate, drink } = req.body;

    if (!vegetable || !meat || !cookingstyle || !flavor || !carbohydrate || !drink) {
        const error = "401: you must provide all the ingredients!";
        res.status(401).json({ error: error });
        return;
    }

    try {
        // let product = this.toString(cookingstyle) + "ed " + this.toString(flavor) + " " + this.toString(meat) + " with " + this.toString(vegetable);

        let product = `${cookingstyle}ed ${flavor} ${meat} with ${vegetable} serving with ${carbohydrate} and ${drink}`;
        let newDish = await MenuData.addDish(xss(vegetable), xss(meat), xss(cookingstyle), xss(flavor), xss(carbohydrate), xss(drink), product);
        if (!newDish) {
            const error = "401 : The dish cannot be served.";
            res.status(401).json({ error: error });
            return;
        } else {
            res.status(200).json(newDish);

        }
    } catch (e) {

        res.status(500).json({ error: e });
    }

});

router.post("/FDishes", async(req, res) => {
    const { UserID, DishID, product, carbohydrate, drink, comments } = req.body;
    if (!UserID || !DishID || !product || !carbohydrate || !drink || !comments) {
        const error = "the final dishes cannot be served";
        res.status(401).json({ error: error });
        return;
    }
    try {
        let newFinishedDishes = finishedMenu.addFinishedDish(UserID, dishID, product, carbohydrate, drink, comments);
        if (newFinishedDishes == null || newFinishedDishes === undefined) {
            const error = "the finished dishes cannot be served";
            res.status(401).json({ error: error });
            return;
        } else {
            res.status(200).json(newFinishedDishes);
            return;
        }
    } catch (e) {
        res.status(500).json({ error: e });
        return;
    }


});

module.exports = router;



// test Json:
// {
// 	"vegetable": "Tomatao",
//      "meat": "Pork",
//     "cookingstyle": "Stew",
//     "flavor": "Mild",
//     "carbohydrate": "Rice",
//     "drink": "Milk"

// }