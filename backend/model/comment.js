const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    replies: [this],
    replied_to: mongoose.Schema.Types.ObjectId,
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    date: {
        type: Number,
        default: Date.now()
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;