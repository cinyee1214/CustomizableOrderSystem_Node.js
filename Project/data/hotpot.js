const mongoCollections = require("../config/mongoCollections");
const hotpot = mongoCollections.hotpot;
const { ObjectId } = require('mongodb');
module.exports = {
    async addHotpot(user_id, numofGuest, section, date) {
        const hotpotCollection = await hotpot();
        let newHotpot = {
            userId: user_id,
            numofGuest: numofGuest,
            section: section,
            date: date
        };
        const insertInfo = hotpotCollection.insertOne(newHotpot);
        if (insertInfo.insertedCount === 0) throw "Could not add Hotpot.";
        const newId = insertInfo.insertedId;
        console.log(newId);
        let Hotpot = await this.getHotpot(newId);
        return Hotpot;

    },
    async getHotpot(id) {
        if (!id) throw "You must provide an userid to search for";
        if (typeof (id) !== "string") throw "id type must be string";
        if (typeof (id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }

        const hotpotCollection = await hotpot();
        const reserveHotpot = await hotpotCollection.findOne({ _id: id });
        if (reserveHotpot === null) throw "No dish with that id";
        return reserveHotpot;
    },
    async getAllHotpot() {
        const HotpotCollection = await hotpot();
        const allHotpot = await HotpotCollection.find({}).toArray();
        return allHotpot;
    },


    async removeHotpot(id) {
        if (!id) throw "You must provide an Userid to search for";
        if (typeof (id) !== "string" && typeof (id) !== "object") throw "id type must be string or object";
        if (typeof (id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }

        const HotpotCollection = await hotpot();
        const deleledHotpot = await this.getHotpot(id);
        const deletionInfo = await HotpotCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete dish with id of ${id},it does not exist`;
        }

        return deletedHotpot;

    },

    async updateDish(id, numofGuest, section, date) {
        if (arguments.length < 4) throw "arguments are not enough";
        if (!id) throw "You must provide an id to search for";
        if (id === undefined) throw "id not defined";
        if (typeof (id) !== "string" && typeof (id) !== "object") throw "id type must be string or object";
        if (typeof (id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }
        if (!numofGuest) throw "You have to provide the Guest number";
        if (typeof (numofGuest) !== "string") throw "You have to provide the number of the guest";
        if (!section) throw "You have to provide a section";
        if (section != "smoked" || section != "unsmoked") throw "you have to provide a valid section";
        if (date === undefined) throw "The date is invalid";
        if (typeof (date) !== "string") throw "The date is not a string";


        const HotpotCollection = await hotpot();

        const updatedHotpot = {
            numofGuest: numofGuest,
            section: section,
            date: date
        };

        const updatedInfo = await HotpotCollection.updateOne({ _id: id }, { $set: updatedHotpot });
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update the dish successfully";
        }

        return await this.getHotpot(id);
    }
};