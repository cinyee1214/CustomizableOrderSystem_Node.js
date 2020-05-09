const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const saltRounds = 5;

module.exports = {

    async addUser(firstName, lastName, Email, Address, Contactnumber, password) {
        // if (arguments.length < 6) throw "arguments are not enough";

        // if (!lastName) throw "You must provide a last Name";

        // if (typeof lastName !== "string") throw "last Name value is not a string";
        // if (!Email) throw "You must provide a Email";

        // if (typeof Email !== "string") throw "Email value is not a string";
        // if (!Address) throw "You must provide Address";

        // if (typeof Address !== "string") throw "Address value is not a string";
        // if (!Contactnumber) throw "You must provide Contact number";

        // if (typeof Contactnumber !== "string") throw "Contact number value is not a string";
        // if (!hashedPassword) throw "You must provide hashedPassword";

        // if (typeof hashedPassword !== "string") throw "hashedPassword value is not a string";


        const userCollection = await users();

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            Email: Email,
            Address: Address,
            Contactnumber: Contactnumber,
            hashedPassword: hashedPassword
        };

        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw "Could not add user";
        const newId = insertInfo.insertedId;
        const user = await this.getUserByID(newId);
        return user;
    },


    async getAllUser() {
        const userCollection = await users();
        const allUsers = await userCollection.find({}).toArray();
        return allUsers;
    },


    async getUserByID(id) {
        if (!id) throw "getUserByID: You must provide an id to search for";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "getUserByID: id type must be string or object";
        if (typeof(id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }

        const userCollection = await users();
        const usergo = await userCollection.findOne({ _id: id });

        return usergo;
    },

    async getUserByEmail(email) {

        const userCollection = await users();

        const user = await userCollection.findOne({ Email: email });

        return user;
    },

    async removeUser(id) {
        if (!id) throw "You must provide an id to search for";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "id type must be string or object";
        if (typeof(id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }

        const userCollection = await users();
        const user = await this.getUserByID(id);
        const deletionInfo = await userCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${id},it does not exist`;
        }

        return user;

    },

    // async updateUser(id, firstName, lastName, Email, Address, Contactnumber, hashedPassword) {
    //     if (arguments.length < 7) throw "arguments are not enough";
    //     if (!id) throw "You must provide an id to search for";
    //     if (id === undefined) throw "id not defined";
    //     if (typeof(id) !== "string" && typeof(id) !== "object") throw "id type must be string or object";
    //     if (typeof(id) !== "object") {
    //         id = ObjectId.createFromHexString(id);
    //     }

    //     if (!firstName) throw "You must provide a first Name";
    //     if (firstName === undefined) throw "first Name not defined";
    //     if (typeof firstName !== "string") throw "first Name value is not a string";
    //     if (!lastName) throw "You must provide a last Name";
    //     if (lastName === undefined) throw "last Name not defined";
    //     if (typeof lastName !== "string") throw "last Name value is not a string";
    //     if (!Email) throw "You must provide a Email";
    //     if (Email === undefined) throw "Email not defined";
    //     if (typeof Email !== "string") throw "Email value is not a string";

    //     if (!Address) throw "You must provide Address";
    //     if (Address === undefined) throw "Address not defined";
    //     if (typeof Address !== "string") throw "Address value is not a string";
    //     if (!Contactnumber) throw "You must provide Contact number";
    //     if (Contactnumber === undefined) throw "Contact number not defined";
    //     if (typeof Contactnumber !== "string") throw "Contact number value is not a string";
    //     if (!hashedPassword) throw "You must provide hashedPassword";
    //     if (hashedPassword === undefined) throw "hashedPassword not defined";
    //     if (typeof hashedPassword !== "string") throw "hashedPassword value is not a string";


    //     const userCollection = await users();

    //     const hashedPassword1 = await bcrypt.hash(hashedPassword, saltRounds);

    //     const updatedUser = {
    //         firstName: firstName,
    //         lastName: lastName,
    //         Email: Email,
    //         Address: Address,
    //         Contactnumber: Contactnumber,
    //         hashedPassword: hashedPassword1
    //     };

    //     const updatedInfo = await userCollection.updateOne({ _id: id }, { $set: updatedUser });
    //     if (updatedInfo.modifiedCount === 0) {
    //         throw "could not update the user successfully";
    //     }

    //     return await this.getUserByID(id);
    // }

    async updateUser(id, updatedObject) {
        if (!id) throw "updateUser: You must provide an id to update";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "updateUser: id type must be string or object";
        if (typeof(id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }

        const userCollection = await users();

        console.log("updatedObject: " + JSON.stringify(updatedObject));

        // const updatedUserData = {};

        // if (updatedObject.firstname) {
        //     updatedUserData.firstName = updatedObject.firstname;
        // }

        // console.log("updatedUserData: " + JSON.stringify(updatedUserData));

        const updatedInfo = await userCollection.updateOne({ _id: id }, { $set: updatedObject });
        console.log(updatedInfo.modifiedCount);

        if (updatedInfo.modifiedCount === 0) {
            throw "could not update the user successfully";
        }

        return await this.getUserByID(id);
    }
};