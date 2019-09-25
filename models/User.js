const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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


userSchema.pre("save", function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);

            this.password = hash;
            next()
        })
    })
})


const User = mongoose.model("User", userSchema);
module.exports = User;