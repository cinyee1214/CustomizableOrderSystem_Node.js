const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');



module.exports = {
    
    async addUser(firstName, lastName, Email, Gender, Address, Contactnumber, hashedPassword){
        if (arguments.length < 7) throw "arguments are not enough";

        if (!firstName) throw "You must provide a first Name";
        if (firstName === undefined) throw "first Name not defined";
        if (typeof firstName !== "string") throw "first Name value is not a string";
        if (!lastName) throw "You must provide a last Name";
        if (lastName === undefined) throw "last Name not defined";
        if (typeof lastName !== "string") throw "last Name value is not a string";
        if (!Email) throw "You must provide a Email";
        if (Email === undefined) throw "Email not defined";
        if (typeof Email !== "string") throw "Email value is not a string";
        if (!Gender) throw "You must provide a Gender";
        if (Gender === undefined) throw "Gender not defined";
        if (typeof Gender !== "string") throw "Gender value is not a string";
        if (!Address) throw "You must provide Address";
        if (Address === undefined) throw "Address not defined";
        if (typeof Address !== "string") throw "Address value is not a string";
        if (!Contactnumber) throw "You must provide Contact number";
        if (Contactnumber === undefined) throw "Contact number not defined";
        if (typeof Contactnumber !== "string") throw "Contact number value is not a string";
        if (!hashedPassword) throw "You must provide hashedPassword";
        if (hashedPassword === undefined) throw "hashedPassword not defined";
        if (typeof hashedPassword !== "string") throw "hashedPassword value is not a string";
        

        const userCollection = await users();

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            Email: Email,
            Gender: Gender,
            Address: Address,
            Contactnumber: Contactnumber,
            hashedPassword: hashedPassword
        };

        
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw "Could not add user";
        const newId = insertInfo.insertedId;
        const user = await this.getUser(newId);
        return user;
    },


    async getAllUser(){
        const userCollection = await users();
        const allUsers = await userCollection.find({}).toArray();
        return allUsers;
    },
    

    async getUser(id){
        if (!id) throw "You must provide an id to search for";
        if (typeof(id) != "string" && typeof(id) != "object") throw "id type must be string or object";
        if (typeof(id) !== Object){
            id=ObjectId.createFromHexString(id);
        }

        const userCollection = await users();
        const usergo = await userCollection.findOne({_id: id });
        if (usergo === null) throw "No user with that id";
        return usergo;
    },

    async removeUser(id){
        if (!id) throw "You must provide an id to search for";
        if (typeof(id) != "string" && typeof(id) != "object") throw "id type must be string or object";
        if (typeof(id) !== Object){
            id=ObjectId.createFromHexString(id);
        }

        const userCollection = await users();
        const user = await this.getUser(id);
        const deletionInfo = await userCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0){
            throw `Could not delete user with id of ${id},it does not exist`;
        }

        return user;
        
    },

    async updateUser(id, firstName, lastName, Email, Gender, Address, Contactnumber, hashedPassword){
        if (arguments.length < 8) throw "arguments are not enough";
        if (!id) throw "You must provide an id to search for";
        if (id===undefined) throw "id not defined";
        if (typeof(id) != "string" && typeof(id) != "object") throw "id type must be string or object";
        if (typeof(id) !== Object){
            id=ObjectId.createFromHexString(id);
        }
        
        if (!firstName) throw "You must provide a first Name";
        if (firstName === undefined) throw "first Name not defined";
        if (typeof firstName !== "string") throw "first Name value is not a string";
        if (!lastName) throw "You must provide a last Name";
        if (lastName === undefined) throw "last Name not defined";
        if (typeof lastName !== "string") throw "last Name value is not a string";
        if (!Email) throw "You must provide a Email";
        if (Email === undefined) throw "Email not defined";
        if (typeof Email !== "string") throw "Email value is not a string";
        if (!Gender) throw "You must provide a Gender";
        if (Gender === undefined) throw "Gender not defined";
        if (typeof Gender !== "string") throw "Gender value is not a string";
        if (!Address) throw "You must provide Address";
        if (Address === undefined) throw "Address not defined";
        if (typeof Address !== "string") throw "Address value is not a string";
        if (!Contactnumber) throw "You must provide Contact number";
        if (Contactnumber === undefined) throw "Contact number not defined";
        if (typeof Contactnumber !== "string") throw "Contact number value is not a string";
        if (!hashedPassword) throw "You must provide hashedPassword";
        if (hashedPassword === undefined) throw "hashedPassword not defined";
        if (typeof hashedPassword !== "string") throw "hashedPassword value is not a string";


        const userCollection = await users();
        
        const updatedUser = {
            firstName: firstName,
            lastName: lastName,
            Email: Email,
            Gender: Gender,
            Address: Address,
            Contactnumber: Contactnumber,
            hashedPassword: hashedPassword
        };

        const updatedInfo = await userCollection.updateOne({ _id: id }, {$set: updatedUser});
        if (updatedInfo.modifiedCount === 0){
            throw "could not update the user successfully";
        }

        return await this.getUser(id);
    }


};