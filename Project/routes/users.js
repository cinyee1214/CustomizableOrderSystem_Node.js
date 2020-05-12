const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require('../data');
const userData = data.users;
const hotpotData = data.hotpots;
const dishData = data.dishes;
const saltRounds = 5;

router.get('/', async(req, res) => {
    if (req.session.AuthCookie) {
        res.render('restaurant/userOrder', { layout: false, user: req.session.AuthCookie });
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

        // res.cookie('cos', '');
        // res.clearCookie('cos');

        // res.cookie('hotpot', '');
        // res.clearCookie('hotpot');

        req.session.destroy();

        res.render('login/logout', { layout: false });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// delete user
router.delete('/:id', async(req, res) => {
    if (!req.session.AuthCookie) {
        res.render('login/error', { layout: false });
        return;
    }

    if (!req.params.id) {
        const error = "You must provide the user id.";
        res.status(401).json({ error: error });
        return;
    }

    if (req.session.AuthCookie._id != req.params.id) {
        const error = "You cannot delete this user.";
        res.status(401).json({ error: error });
        return;
    }

    try {
        await userData.getUserById(req.params.id);
        const deletedUser = await userData.removeUser(req.params.id);
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// update user info
router.patch('/', async(req, res) => {
    if (!req.session.AuthCookie) {
        res.render('login/error', { layout: false });
        return;
    }

    const { userId, firstname, lastname, email, password, cpassword, telnum, address } = req.body;

    let updatedObject = {};

    if (!userId) {
        const error = "401: You must provide a userId to update!";
        res.status(401).json({ error: error });
        return;
    }

    if (req.session.AuthCookie._id != userId) {
        const error = "You cannot update this user info.";
        res.status(401).json({ error: error });
        return;
    }

    if (!firstname && !lastname && !email && !password && !cpassword && !telnum && !address) {
        const error = "401: Nothing to update!";
        res.status(401).json({ error: error });
        return;
    }

    if (password && !cpassword) {
        const error = "401 : Please confirm your new password!";
        res.status(401).json({ error: error });
        return;
    }

    if (!password && cpassword) {
        const error = "401 : Please provide your new password!";
        res.status(401).json({ error: error });
        return;
    }
    
    if (password.length < 8) {
        const error = "401 : the password length cannot be less than 8!";
        res.status(401).json({ error: error });
        return;
    }

    if (password && cpassword && password !== cpassword) {
        const error = "401 : The new password and the confirmed password are not the same!";
        res.status(401).json({ error: error });
        return;
    }

    try {
        let user = await userData.getUserByID(xss(userId));

        console.log("patch_getUserByID: " + JSON.stringify(user));

        if (password) {
            let match = await bcrypt.compare(
                xss(password),
                xss(user.hashedPassword)
            );

            if (match) {
                const error = '401: The password is the same as your former password. No need to update!';
                res.status(401).json({ error: error });
                return;
            }
        }

        if (firstname && firstname != user.firstName) {
            updatedObject.firstName = xss(firstname);
        }

        if (lastname && lastname != user.lastName) {
            updatedObject.lastName = xss(lastname);
        }

        if (email && email != user.Email) {
            updatedObject.Email = xss(email);
        }

        if (telnum && telnum != user.Contactnumber) {
            updatedObject.Contactnumber = xss(telnum);
        }

        if (address && address != user.Address) {
            updatedObject.Address = xss(address);
        }

        if (password) {
            updatedObject.hashedPassword = await bcrypt.hash(password, saltRounds);
        }

        console.log("patch_getUserByID: " + JSON.stringify(updatedObject));

        if (Object.keys(updatedObject).length === 0) {
            const error = "401 : Please provide your new information to update!";
            res.status(401).json({ error: error });
            return;
        }

        const updatedUser = await userData.updateUser(
            userId,
            updatedObject
        );

        req.session.AuthCookie = updatedUser;

        let sessionUser = { _id: updatedUser._id, email: xss(updatedUser.Email) };

        res.cookie('user', JSON.stringify(sessionUser));

        res.status(200).json(updatedUser);

    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// get all hotpots belong to this cur user
router.get('/hotpot', async(req, res) => {
    if (!req.session.AuthCookie) {
        res.render('login/error', { layout: false });
        return;
    }

    try {
        let curUser = req.session.AuthCookie;
        console.log(curUser);

        let result = await hotpotData.getAllHotpotByUserId(curUser._id);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ error: e });
        return;
    }
});

// delete hotpot with hotpotID
router.delete('/hotpot/:id', async(req, res) => {
    if (!req.session.AuthCookie) {
        res.render('login/error', { layout: false });
        return;
    }

    if (!req.params.id) {
        const error = "The Hotpot Id is invalid";
        res.status(401).json({ error: error });
        return;
    }

    try {
        let AllHotpotsOfUser = await hotpotData.getAllHotpotByUserId(req.session.AuthCookie._id);
        let findDish = false;

        for (let i = 0; i < AllHotpotsOfUser.length; ++i) {

            if (AllHotpotsOfUser[i]._id == req.params.id) {

                findDish = true;
                break;
            }
        }
        if (!findDish) {
            res.status(401).json({ error: 'You cannot delete this hotpot!' });
            return;
        }

    } catch (e) {
        res.status(500).json({ error: e });
    }

    let ID = req.params.id;
    try {

        let result = await hotpotData.removeHotpot(ID);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ error: e });
    }

});

// get all dishes belong to this cur user
router.get('/cos', async(req, res) => {
    if (!req.session.AuthCookie) {
        res.render('login/error', { layout: false });
        return;
    }

    try {
        let UserID = req.session.AuthCookie._id;
        console.log(UserID);

        let AllDishes = await dishData.getAllDishesByUserId(UserID);
        console.log(AllDishes);

        res.status(200).json(AllDishes);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// delete dish with cosID
router.delete('/cos/:id', async(req, res) => {
    if (!req.session.AuthCookie) {
        res.render('login/error', { layout: false });
        return;
    }

    if (!req.params.id) {
        throw 'You must provide a dish_ID to delete.';
    }

    try {
        await dishData.getDish(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Dish not found' });
        return;
    }

    try {
        let AllDishesOfUser = await dishData.getAllDishesByUserId(req.session.AuthCookie._id);
        let findDish = false;

        for (let i = 0; i < AllDishesOfUser.length; ++i) {

            if (AllDishesOfUser[i]._id == req.params.id) {
                findDish = true;

                break;
            }
        }
        if (!findDish) {
            res.status(401).json({ error: 'You cannot delete this dish!' });
            return;
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }

    try {
        const deletedDish = await dishData.removeDish(req.params.id);
        res.status(200).json(deletedDish);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// update hotpot with hotpotID
router.put("/hotpot/:id", async(req, res) => {
    if (!req.session.AuthCookie) {
        res.render('login/error', { layout: false });
        return;
    }

    let updatedHotpot = req.body;
    console.log(req.params.id);

    if (!req.params.id) {
        const error = "The Hotpot ID cannot be found";
        res.status(401).json({ error: error });
        return;
    }

    if (!updatedHotpot.numOfGuest || !updatedHotpot.section || !updatedHotpot.date) {
        res.status(400).json({ error: 'You must Supply All Fields.' });
        return;
    }

    try {
        let AllHotpotsOfUser = await hotpotData.getAllHotpotByUserId(req.session.AuthCookie._id);
        let findDish = false;

        for (let i = 0; i < AllHotpotsOfUser.length; ++i) {

            if (AllHotpotsOfUser[i]._id == req.params.id) {

                findDish = true;
                break;
            }
        }
        if (!findDish) {
            res.status(401).json({ error: 'You cannot update this hotpot!' });
            return;
        }

    } catch (e) {
        res.status(500).json({ error: e });
    }

    if (!updatedHotpot.date || typeof updatedHotpot.date !== "object" || updatedHotpot.date.length != 3) {
        const error = "Please provide a valid date to reserve!";
        res.status(401).json({ error: error });
        return;
    }

    var today = new Date();

    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();

    console.log(month);
    console.log(typeof month);
    console.log(day);
    console.log(year);

    if (updatedHotpot.date[0] < month || updatedHotpot.date[1] < day || updatedHotpot.date[2] != year) {
        const error = "Please reserve for today or within two weeks!";
        res.status(401).json({ error: error });
        return;
    }

    try {
        let UpdateInfo = await hotpotData.updateHotpot(updatedHotpot._id, xss(updatedHotpot.numOfGuest), xss(updatedHotpot.section), xss(updatedHotpot.date));
        if (UpdateInfo.count == 0) {
            const error = "The hotpot cannot be found";
            res.status(401).json({ error: error });
            return;
        } else {
            res.status(200).json(UpdateInfo);
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// update dish with cosID
router.put('/cos/:id', async(req, res) => {
    if (!req.session.AuthCookie) {
        res.render('login/error', { layout: false });
        return;
    }

    const { vegetable, meat, cookingStyle, flavor, carbohydrate, drink } = req.body;
    if (!vegetable || !meat || !cookingStyle || !flavor || !carbohydrate || !drink) {
        res.status(400).json({ error: 'You must Supply All fields' });
        return;
    }

    if (!req.params.id) {
        const error = "You must provide the dish id.";
        res.status(401).json({ error: error });
        return;
    }

    try {
        await dishData.getDish(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Dish not found' });
        return;
    }

    let product = `${cookingStyle} ${flavor} ${meat} with ${vegetable} serving with ${carbohydrate} and ${drink}`;
    let UserID = req.session.AuthCookie._id;

    console.log(req.params.id);

    try {
        let AllDishesOfUser = await dishData.getAllDishesByUserId(UserID);
        let findDish = false;

        console.log(AllDishesOfUser);
        console.log(AllDishesOfUser.length);
        console.log(typeof AllDishesOfUser);

        for (let i = 0; i < AllDishesOfUser.length; ++i) {
            console.log(req.params.id);
            console.log(AllDishesOfUser[i]._id);
            console.log(typeof AllDishesOfUser[i]._id);

            if (AllDishesOfUser[i]._id == req.params.id) {

                console.log(req.params.id);
                console.log(AllDishesOfUser[i].user_id);

                findDish = true;
                console.log(findDish);

                break;
            }
        }

        console.log(findDish);
        if (!findDish) {
            res.status(401).json({ error: 'You cannot update this dish!' });
            return;
        }

    } catch (e) {
        res.status(500).json({ error: e });
    }


    try {
        const updatedDish = await dishData.updateDish(req.params.id, UserID, xss(vegetable), xss(meat), xss(cookingStyle), xss(flavor), xss(carbohydrate), xss(drink), product);
        res.json(updatedDish);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;
