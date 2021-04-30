const mongoose = require("mongoose");
const uuid = require("uuid");

const commentSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuid.v4()
    },
    user: {
        type: String,
        ref: 'User'
    },
    username: {
        type: String,
        required: true
    },
    text: String,
    replies: [{
        type: String,
        ref: 'Comment'
    }],
    replied_to: String,
    likes: {
        type: [{
            type: String,
            ref: 'User'
        }],
        default: []
    },
    dislikes: {
        type: [{
            type: String,
            ref: 'User'
        }],
        default: []
    },
    date: {
        type: Number,
        default: _ => Date.now()
    },
    post: {
        type: String,
        ref: 'Post'
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;