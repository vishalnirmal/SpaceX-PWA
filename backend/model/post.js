const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;