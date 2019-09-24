const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    joinDate: {
        type: Date,
        default: Date.now
    },

    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Recipe'
    }

})

const User = mongoose.model("User", userSchema);

module.exports = User;