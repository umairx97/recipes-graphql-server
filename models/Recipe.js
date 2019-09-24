const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    instructions: {
        type: String,
        required: true
    },

    createdDate: {
        type: Date,
        default: Date.now
    },

    likes: {
        type: Number,
        default: 0
    },

    username: {
        type: String,
    }

})

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;