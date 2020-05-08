const userData = require("./users");
const dishData = require("./dishes");
const finishedDishData = require("./finishedDishes");
const commentData = require("./comments");
const feedbackData = require("./feedbacks");
const hotpotData = require("./hotpots");

module.exports = {
    users: userData,
    dishes: dishData,
    finishedDishes: finishedDishData,
    comments: commentData,
    feedbacks: feedbackData,
    hotpots: hotpotData
};