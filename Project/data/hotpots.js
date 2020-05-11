const mongoCollections = require("../config/mongoCollections");
const hotpots = mongoCollections.hotpots;
const { ObjectId } = require('mongodb');

module.exports = {
    async addHotpot(user_id, numofGuest, section, date) {
        const hotpotCollection = await hotpots();
        let newHotpot = {
            userId: user_id,
            numofGuest: numofGuest,
            section: section,
            date: date
        };

        const insertInfo = await hotpotCollection.insertOne(newHotpot);
        if (insertInfo.insertedCount === 0) throw "Could not add Hotpot.";

        // console.log(1);
        console.log(insertInfo.insertedCount);
        const hotpotId = insertInfo.insertedId;

        // console.log(hotpotId);
        let Hotpot = await this.getHotpot(hotpotId);

        console.log(2);
        return Hotpot;

    },

    async getHotpot(id) {
        console.log(3);

        if (!id) throw "You must provide an hotpot_id to search for";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "id type must be string";
        if (typeof(id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }

        const hotpotCollection = await hotpots();
        const reserveHotpot = await hotpotCollection.findOne({ _id: id });
        if (reserveHotpot === null) throw "No hotpot with that id";
        return reserveHotpot;
    },

    async getAllHotpot() {
        const HotpotCollection = await hotpots();
        const allHotpot = await HotpotCollection.find({}).toArray();
        return allHotpot;
    },

    async getAllHotpotByUserId(id) {
        const HotpotCollection = await hotpots();
        const allHotpot = await HotpotCollection.find({ userId: id }).toArray();

        console.log(allHotpot);

        return allHotpot;

        // console.log(allHotpot);
        // let result = new Array(0);
        // for (i = 0; i < allHotpot.length; ++i) {
        //     if (allHotpot[i].userId == id) {
        //         result.push(allHotpot[i]);
        //     }
        // }
        // return result;
    },

    async removeHotpot(id) {
        if (!id) throw "You must provide an Userid to search for";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "id type must be string or object";
        if (typeof(id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }

        const HotpotCollection = await hotpots();
        const deleledHotpot = await this.getHotpot(id);
        const deletionInfo = await HotpotCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete dish with id of ${id},it does not exist`;
        }

        return deleledHotpot;

    },

    async updateHotpot(id, numofGuest, section, date) {
        if (arguments.length < 4) throw "arguments are not enough";
        if (!id) throw "You must provide an id to search for";
        if (id === undefined) throw "id not defined";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "id type must be string or object";
        if (typeof(id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }
        if (!numofGuest) throw "You have to provide the Guest number";
        if (typeof(numofGuest) !== "string") throw "You have to provide the number of the guest";
        if (!section) throw "You have to provide a section";
        if (section != "smoked" && section != "unsmoked") throw "you have to provide a valid section";
        if (date === undefined) throw "The date is invalid";



        const HotpotCollection = await hotpots();

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