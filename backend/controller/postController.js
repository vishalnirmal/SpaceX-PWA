require('dotenv').config();
const Post = require("../model/post");

const addPost = async (obj)=>{
    return new Promise((resolve, reject)=>{
        Post.create(obj).then(response=>{
            if (!response)
                reject("Unable to add post");
            resolve(response);
        }).catch(reject);
    });
}

const deletePost = async (whereClause) => {
    return new Promise((resolve, reject)=>{
        Post.deleteMany(whereClause).then(response=>{
            resolve(response.deletedCount);
        }).catch(reject);
    });
}

const getPost = async (whereClause) => {
    return new Promise((resolve, reject)=>{
        Post.findOne(whereClause).then(response=>{
            if (!response)
                reject("No post found");
            resolve(response);
        }).catch(reject);
    });
}

module.exports = {
    addPost,
    getPost,
    deletePost
};