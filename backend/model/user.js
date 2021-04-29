const mongoose = require("mongoose");
const uuid = require("uuid");

const userSchema = mongoose.Schema({
    _id: {
        type: String,
        default: function genUUID(){
            return uuid.v4()
        }
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}); 

const User = mongoose.model("User", userSchema);

module.exports = User;