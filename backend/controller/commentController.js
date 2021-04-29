require('dotenv').config();
const Comment = require("../model/comment");

const addComment = async (obj) => {
    return new Promise((resolve, reject) => {
        Comment.create(obj).then(async(response) => {
            if (!response)
                reject("Unable to add comment");
            resolve(response);
        }).catch(reject);
    });
}

const updateComment = async (whereClause, obj) => {
    return new Promise((resolve, reject) => {
        Comment.findOneAndUpdate(whereClause, obj, {
            new: true
        }).then(async(response) => {
            if (!response)
                reject("No comment to update");
            resolve(response);
        }).catch(reject);
    });
}

const getComment = async (whereClause) => {
    return new Promise((resolve, reject) => {
        Comment.findOne(whereClause).then(response => {
            if (!response)
                reject("No comment found");
            resolve(response);
        }).catch(reject);
    });
}

const getComments = async (post_id) => {
    return new Promise((resolve, reject) => {
        Comment.find({
                post: post_id
            })
            .then(response => {
                resolve(response);
            })
            .catch(reject);
    });
}

const deleteComment = async (whereClause) => {
    return new Promise((resolve, reject)=>{
        Comment.findOneAndDelete(whereClause).then(response=>{
            if (!response)
                reject("The comment which was to be removed didn't exist");
            resolve(response);
        }).catch(reject);
    });
}

const getUserLikes = async (user_id) => {
    return new Promise((resolve, reject) => {
        Comment.find({
            likes: user_id
        }, {
            _id: 1
        }).then(response => {
            resolve(response);
        }).catch(reject);
    });
}

const getUserDislikes = async (user_id) => {
    return new Promise((resolve, reject) => {
        Comment.find({
            dislikes: user_id
        }, {
            _id: 1
        }).then(response => {
            resolve(response);
        }).catch(reject);
    });
}

module.exports = {
    addComment,
    updateComment,
    getComment,
    getComments,
    deleteComment,
    getUserLikes,
    getUserDislikes
};