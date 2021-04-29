const mongoose = require("mongoose");
const uuid = require("uuid");

const postSchema = mongoose.Schema({
    _id: {
        type: String,
        default: function genUUID(){
            return uuid.v4()
        }
    },
    name: {
        type: String,
        required: true
    }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;