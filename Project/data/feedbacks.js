const mongoCollections = require("../config/mongoCollections");
const feedbacks = mongoCollections.feedbacks;

module.exports = {
    async addFeedback(firstname, lastname, areacode, telnum, emailid, feedback) {
        if (!firstname) throw "You must provide an first name.";
        if (!lastname) throw "You must provide an last name.";
        if (!areacode) throw "You must provide an areacode.";
        if (!telnum) throw "You must provide an tel number.";
        if (!emailid) throw "You must provide an email id.";
        if (!feedback) throw "You must provide an user feedback.";
        const feedbackCollection = await feedbacks();

        let newFeedback = {
            firstname: firstname,
            lastname: lastname,
            areacode: areacode,
            telnum: telnum,
            emailid: emailid,
            feedback: feedback
        };

        const insertInfo = await feedbackCollection.insertOne(newFeedback);
        if (insertInfo.insertedCount === 0) throw "Failed to add this feedback.";
        const newId = insertInfo.insertedId;
        const feedBack = await this.getFeedback(newId);
        return feedBack;
    },

    async getFeedback(id) {

        const feedbackCollection = await feedbacks();
        const feedbacksgo = await feedbackCollection.findOne({ _id: id });
        if (feedbacksgo === null) throw "No feedback with this id.";
        return feedbacksgo;
    },

    async getAllFeedbacks() {
        const feedbackCollection = await feedbacks();
        const allFeedbacks = await feedbackCollection.find({}).toArray();
        return allFeedbacks;
    }

}
