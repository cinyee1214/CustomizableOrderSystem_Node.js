const mongoCollections = require("../config/mongoCollections");
const feedbacks = mongoCollections.feedbacks;

module.exports = {
    async addFeedback(firstname, lastname, areacode, telnum, emailid, feedback) {
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
    }
}