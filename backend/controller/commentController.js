require('dotenv').config();
const Comment = require("../model/comment");

const addComment = async (obj) => {
    return new Promise((resolve, reject) => {
        Comment.create(obj).then(async(response) => {
            if (!response)
                reject("Unable to add comment");
            let comment = await response.populate('user').execPopulate();
            resolve(comment);
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
            let comment = await response.populate('user').populate({
                path: 'replies',
                populate: {
                    path: 'user',
                    select: 'name'
                }
            }).execPopulate();
            resolve(comment);
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
                replied_to: {
                    $exists: false
                },
                post: post_id
            })
            .populate('user', 'name')
            .populate({
                path: "replies",
                populate: {
                    path: "user",
                    select: "name"
                }
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
            Promise.all(response.replies.map(reply=>{
                return deleteComment({
                    _id: reply._id
                });
            })).then(_=>{
                if (!response.replied_to){
                    updateComment({
                        replies: response._id
                    }, {
                        $pull: {
                            replies: response._id
                        }
                    }).then(_=>{
                        resolve(response);
                    }).catch(reject);
                }
                resolve(response);
            }).catch(reject);
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