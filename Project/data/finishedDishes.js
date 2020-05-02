const mongoCollections = require("../config/mongoCollections");
const finishedDishes = mongoCollections.finishedDishes;
const { ObjectId } = require('mongodb');



module.exports = {

    async addFinishedDish(dish_id, user_id, product, carbohydrate, drink, comments) {
        if (arguments.length < 6) throw "arguments are not enough";
        if (!dish_id) throw "You must provide a dish_id to search for";
        if (dish_id === undefined) throw "dish_id not defined";
        if (typeof(dish_id) != "string" && typeof(dish_id) != "object") throw "dish_id type must be string or object";
        if (typeof(dish_id) !== Object) {
            dish_id = ObjectId.createFromHexString(dish_id);
        }
        if (!user_id) throw "You must provide a user_id to search for";
        if (user_id === undefined) throw "user_id not defined";
        if (typeof(user_id) != "string" && typeof(user_id) != "object") throw "user_id type must be string or object";
        if (typeof(user_id) !== Object) {
            user_id = ObjectId.createFromHexString(user_id);
        }

        if (!product) throw "You must provide a product";
        if (product === undefined) throw "product not defined";
        if (typeof product !== "string") throw "product value is not a string";
        if (!carbohydrate) throw "You must provide a carbohydrate";
        if (carbohydrate === undefined) throw "carbohydrate not defined";
        if (typeof carbohydrate !== "string") throw "carbohydrate value is not a string";
        if (!drink) throw "You must provide drink";
        if (drink === undefined) throw "drink not defined";
        if (typeof drink !== "string") throw "drink value is not a string";
        if (!comments || !Array.isArray(comments)) throw 'You must provide an array of comments';
        if (comments.length <= 0) throw 'You must provide at least one comment.';


        const finishedDishCollection = await finishedDishes();

        let newFinishedDish = {
            dish_id: dish_id,
            user_id: user_id,
            product: product,
            carbohydrate: carbohydrate,
            drink: drink,
            comments: comments
        };


        const insertInfo = await finishedDishCollection.insertOne(newFinishedDish);
        if (insertInfo.insertedCount === 0) throw "Could not add finished Dish";
        const newId = insertInfo.insertedId;
        const finishedDish = await this.getFinishedDish(newId);
        return finishedDish;
    },


    async getAllFinishedDish() {
        const finishedDishCollection = await finishedDishes();
        const allFinishedDishes = await finishedDishCollection.find({}).toArray();
        return allFinishedDishes;
    },


    async getFinishedDish(id) {
        if (!id) throw "You must provide an id to search for";
        if (typeof(id) != "string" && typeof(id) != "object") throw "id type must be string or object";
        if (typeof(id) !== Object) {
            id = ObjectId.createFromHexString(id);
        }

        const finishedDishCollection = await finishedDishes();
        const finishedDishgo = await finishedDishCollection.findOne({ _id: id });
        if (finishedDishgo === null) throw "No finished Dish with that id";
        return finishedDishgo;
    },

    async removeFinishedDish(id) {
        if (!id) throw "You must provide an id to search for";
        if (typeof(id) != "string" && typeof(id) != "object") throw "id type must be string or object";
        if (typeof(id) !== Object) {
            id = ObjectId.createFromHexString(id);
        }

        const finishedDishCollection = await finishedDishes();
        const finishedDish = await this.getFinishedDish(id);
        const deletionInfo = await finishedDishCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete finished Dish with id of ${id},it does not exist`;
        }

        return finishedDish;

    },

    async updateFinishedDish(id, dish_id, user_id, product, carbohydrate, drink, comments) {
        if (arguments.length < 7) throw "arguments are not enough";
        if (!id) throw "You must provide an id to search for";
        if (id === undefined) throw "id not defined";
        if (typeof(id) != "string" && typeof(id) != "object") throw "id type must be string or object";
        if (typeof(id) !== Object) {
            id = ObjectId.createFromHexString(id);
        }
        if (!dish_id) throw "You must provide a dish_id to search for";
        if (dish_id === undefined) throw "dish_id not defined";
        if (typeof(dish_id) != "string" && typeof(dish_id) != "object") throw "dish_id type must be string or object";
        if (typeof(dish_id) !== Object) {
            dish_id = ObjectId.createFromHexString(dish_id);
        }
        if (!user_id) throw "You must provide a user_id to search for";
        if (user_id === undefined) throw "user_id not defined";
        if (typeof(user_id) != "string" && typeof(user_id) != "object") throw "user_id type must be string or object";
        if (typeof(user_id) !== Object) {
            user_id = ObjectId.createFromHexString(user_id);
        }

        if (!product) throw "You must provide a product";
        if (product === undefined) throw "product not defined";
        if (typeof product !== "string") throw "product value is not a string";
        if (!carbohydrate) throw "You must provide a carbohydrate";
        if (carbohydrate === undefined) throw "carbohydrate not defined";
        if (typeof carbohydrate !== "string") throw "carbohydrate value is not a string";
        if (!drink) throw "You must provide drink";
        if (drink === undefined) throw "drink not defined";
        if (typeof drink !== "string") throw "drink value is not a string";
        if (!comments || !Array.isArray(comments)) throw 'You must provide an array of comments';
        if (comments.length <= 0) throw 'You must provide at least one comment.';



        const finishedDishCollection = await finishedDishes();

        const updatedFinishedDish = {
            dish_id: dish_id,
            user_id: user_id,
            product: product,
            carbohydrate: carbohydrate,
            drink: drink,
            comments: comments
        };

        const updatedInfo = await finishedDishCollection.updateOne({ _id: id }, { $set: updatedFinishedDish });
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update the finished Dish successfully";
        }

        return await this.getFinishedDish(id);
    }


};