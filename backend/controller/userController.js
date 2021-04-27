require("dotenv").config();
const User = require("../model/user");

const addUser = (obj) => {
    return new Promise((resolve, reject) => {
        User.create(obj).then(user => {
            if (!user)
                reject("Unable to create user");
            resolve(user)
        }).catch(reject);
    });
}

const getUser = (whereClause) => {
    return new Promise((resolve, reject)=>{
        User.findOne(whereClause).then(user=>{
            if (!user)
                reject("No user found.");
            resolve(user)
        }).catch(reject);
    });
}

const updateUser = (whereClause, obj) => {
    return new Promise((resolve, reject) => {
        User.findOneAndUpdate(whereClause, obj, {
            new: true
        }).then(user => {
            if (!user) reject("No document to update.");
            resolve(user);
        }).catch(reject);
    });
}

const removeUser = (whereClause) => {
    return new Promise((resolve, reject) => {
        User.findOneAndRemove(whereClause).then(user => {
            if (!user)
                reject("No user found to remove");
            resolve(user);
        }).catch(reject);
    })
}

const removeAllUsers = () => {
    return new Promise((resolve, reject)=>{
        User.deleteMany({}).then(users=>{
            if (users.deletedCount === 0)
                reject("No users to remove");
            resolve(users.deletedCount);
        }).catch(reject);
    });
}

module.exports = {
    addUser,
    getUser,
    updateUser,
    removeUser,
    removeAllUsers
};