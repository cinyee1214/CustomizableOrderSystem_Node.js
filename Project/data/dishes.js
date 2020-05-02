const mongoCollections = require("../config/mongoCollections");
const dishes = mongoCollections.dishes;
const { ObjectId } = require('mongodb');



module.exports = {
    
    async addDish(vegetable, meat, cookingStyle, flavor, carbohydrate, drink, product){
        if (arguments.length < 7) throw "arguments are not enough";
        if (!vegetable) throw "You must provide a vegetable";
        if (vegetable === undefined) throw "vegetable not defined";
        if (typeof vegetable !== "string") throw "vegetable value is not a string";
        if (!meat) throw "You must provide a meat";
        if (meat === undefined) throw "meat not defined";
        if (typeof meat !== "string") throw "meat value is not a string";
        if (!cookingStyle) throw "You must provide a cookingStyle";
        if (cookingStyle === undefined) throw "cookingStyle not defined";
        if (typeof cookingStyle !== "string") throw "cookingStyle value is not a string";
        if (!flavor) throw "You must provide a flavor";
        if (flavor === undefined) throw "flavor not defined";
        if (typeof flavor !== "string") throw "flavor value is not a string";
        if (!carbohydrate) throw "You must provide carbohydrate";
        if (carbohydrate === undefined) throw "carbohydrate not defined";
        if (typeof carbohydrate !== "string") throw "carbohydrate value is not a string";
        if (!drink) throw "You must provide drink";
        if (drink === undefined) throw "drink not defined";
        if (typeof drink !== "string") throw "drink value is not a string";
        if (!product) throw "You must provide product";
        if (product === undefined) throw "product not defined";
        if (typeof product !== "string") throw "product value is not a string";
        

        const dishCollection = await dishes();

        let newDish = {
            vegetable: vegetable,
            meat: meat,
            cookingStyle: cookingStyle,
            flavor: flavor,
            carbohydrate: carbohydrate,
            drink: drink,
            product: product
        };

        
        const insertInfo = await dishCollection.insertOne(newDish);
        if (insertInfo.insertedCount === 0) throw "Could not add dish";
        const newId = insertInfo.insertedId;
        const dish = await this.getDish(newId);
        return dish;
    },


    async getAllDish(){
        const dishCollection = await dishes();
        const allDishes = await dishCollection.find({}).toArray();
        return allDishes;
    },
    

    async getDish(id){
        if (!id) throw "You must provide an id to search for";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "id type must be string or object";
        if (typeof(id) !== "object"){
            id=ObjectId.createFromHexString(id);
        }

        const dishCollection = await dishes();
        const dishgo = await dishCollection.findOne({_id: id });
        if (dishgo === null) throw "No dish with that id";
        return dishgo;
    },

    async removeDish(id){
        if (!id) throw "You must provide an id to search for";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "id type must be string or object";
        if (typeof(id) !== "object"){
            id=ObjectId.createFromHexString(id);
        }

        const dishCollection = await dishes();
        const dish = await this.getDish(id);
        const deletionInfo = await dishCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0){
            throw `Could not delete dish with id of ${id},it does not exist`;
        }

        return dish;
        
    },

    async updateDish(id, vegetable, meat, cookingStyle, flavor, carbohydrate, drink, product){
        if (arguments.length < 8) throw "arguments are not enough";
        if (!id) throw "You must provide an id to search for";
        if (id===undefined) throw "id not defined";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "id type must be string or object";
        if (typeof(id) !== "object"){
            id=ObjectId.createFromHexString(id);
        }
        
        if (!vegetable) throw "You must provide a vegetable";
        if (vegetable === undefined) throw "vegetable not defined";
        if (typeof vegetable !== "string") throw "vegetable value is not a string";
        if (!meat) throw "You must provide a meat";
        if (meat === undefined) throw "meat not defined";
        if (typeof meat !== "string") throw "meat value is not a string";
        if (!cookingStyle) throw "You must provide a cookingStyle";
        if (cookingStyle === undefined) throw "cookingStyle not defined";
        if (typeof cookingStyle !== "string") throw "cookingStyle value is not a string";
        if (!flavor) throw "You must provide a flavor";
        if (flavor === undefined) throw "flavor not defined";
        if (typeof flavor !== "string") throw "flavor value is not a string";
        if (!carbohydrate) throw "You must provide carbohydrate";
        if (carbohydrate === undefined) throw "carbohydrate not defined";
        if (typeof carbohydrate !== "string") throw "carbohydrate value is not a string";
        if (!drink) throw "You must provide drink";
        if (drink === undefined) throw "drink not defined";
        if (typeof drink !== "string") throw "drink value is not a string";
        if (!product) throw "You must provide product";
        if (product === undefined) throw "product not defined";
        if (typeof product !== "string") throw "product value is not a string";


        const dishCollection = await dishes();
        
        const updatedDish = {
            vegetable: vegetable,
            meat: meat,
            cookingStyle: cookingStyle,
            flavor: flavor,
            carbohydrate: carbohydrate,
            drink: drink,
            product: product
        };

        const updatedInfo = await dishCollection.updateOne({ _id: id }, {$set: updatedDish});
        if (updatedInfo.modifiedCount === 0){
            throw "could not update the dish successfully";
        }

        return await this.getDish(id);
    }


};