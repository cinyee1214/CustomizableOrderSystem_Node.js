const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const { ObjectId } = require('mongodb');



module.exports = {

    async addComment(user_id, finishedDish_id, commentText) {
        if (arguments.length < 3) throw "arguments are not enough";
        if (!user_id) throw "You must provide a user_id to search for";
        if (user_id === undefined) throw "user_id not defined";
        if (typeof(user_id) != "string" && typeof(user_id) != "object") throw "user_id type must be string or object";
        if (typeof(user_id) !== "object") {
            user_id = ObjectId.createFromHexString(user_id);
        }
        if (!finishedDish_id) throw "You must provide a finishedDish_id to search for";
        if (finishedDish_id === undefined) throw "finishedDish_id not defined";
        if (typeof(finishedDish_id) !== "string" && typeof(finishedDish_id) !== "object") throw "finishedDish_id type must be string or object";
        if (typeof(finishedDish_id) !== "object") {
            finishedDish_id = ObjectId.createFromHexString(finishedDish_id);
        }

        if (!commentText) throw "You must provide a comment Text";
        if (commentText === undefined) throw "comment Text not defined";
        if (typeof commentText !== "string") throw "comment Text value is not a string";



        const commentCollection = await comments();

        let newComment = {
            user_id: user_id,
            finishedDish_id: finishedDish_id,
            commentText: commentText
        };


        const insertInfo = await commentCollection.insertOne(newComment);
        if (insertInfo.insertedCount === 0) throw "Could not add comment text";
        const newId = insertInfo.insertedId;
        const comment = await this.getComment(newId);
        return comment;
    },


    async getAllComment() {
        const commentCollection = await comments();
        const allComments = await commentCollection.find({}).toArray();
        return allComments;
    },


    async getComment(id) {
        if (!id) throw "You must provide an id to search for";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "id type must be string or object";
        if (typeof(id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }

        const commentCollection = await comments();
        const commentgo = await commentCollection.findOne({ _id: id });
        if (commentgo === null) throw "No comment txt with that id";
        return commentgo;
    },

    async removeComment(id) {
        if (!id) throw "You must provide an id to search for";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "id type must be string or object";
        if (typeof(id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }

        const commentCollection = await comments();
        const comment = await this.getComment(id);
        const deletionInfo = await commentCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete comment text with id of ${id},it does not exist`;
        }

        return comment;

    },

    async updateComment(id, user_id, finishedDish_id, commentText) {
        if (arguments.length < 4) throw "arguments are not enough";
        if (!id) throw "You must provide an id to search for";
        if (id === undefined) throw "id not defined";
        if (typeof(id) !== "string" && typeof(id) !== "object") throw "id type must be string or object";
        if (typeof(id) !== "object") {
            id = ObjectId.createFromHexString(id);
        }
        if (!user_id) throw "You must provide a user_id to search for";
        if (user_id === undefined) throw "user_id not defined";
        if (typeof(user_id) !== "string" && typeof(user_id) !== "object") throw "user_id type must be string or object";
        if (typeof(user_id) !== "object") {
            user_id = ObjectId.createFromHexString(user_id);
        }
        if (!finishedDish_id) throw "You must provide a finishedDish_id to search for";
        if (finishedDish_id === undefined) throw "finishedDish_id not defined";
        if (typeof(finishedDish_id) != "string" && typeof(finishedDish_id) != "object") throw "finishedDish_id type must be string or object";
        if (typeof(finishedDish_id) !== "object") {
            finishedDish_id = ObjectId.createFromHexString(finishedDish_id);
        }

        if (!commentText) throw "You must provide a comment Text";
        if (commentText === undefined) throw "comment Text not defined";
        if (typeof commentText !== "string") throw "comment Text value is not a string";



        const commentCollection = await comments();

        const updatedComment = {
            user_id: user_id,
            finishedDish_id: finishedDish_id,
            commentText: commentText
        };

        const updatedInfo = await commentCollection.updateOne({ _id: id }, { $set: updatedComment });
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update the comment successfully";
        }

        return await this.getComment(id);
    }


};