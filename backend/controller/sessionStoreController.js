require('dotenv').config();
const sessionStore = require("../database/model/sessionStore");

const addSession = (obj) => {
    return new Promise((resolve, reject)=>{
        sessionStore.create(obj).then(session=>{
            if (!session)
                reject("Unable to add session");
            resolve(session);
        }).catch(err=>{
            reject(err);
        });
    });
}

const updateSession = (whereClause, obj) => {
    return new Promise((resolve, reject)=>{
        sessionStore.updateOne(whereClause, obj, {new: true}).then(session=>{
            resolve(session);
        }).catch(err=>{
            reject(err);
        });
    });
}

const deleteSession = (id) => {
    return new Promise((resolve, reject)=>{
        sessionStore.findByIdAndDelete(id).then(session=>{
            if (!session) reject("No document to delete")
            resolve(session);
        }).catch(err=>{
            reject(err);
        })
    });
}

const getSession = (whereClause) => {
    return new Promise((resolve, reject)=>{
        sessionStore.findOne(whereClause).then(session=>{
            if (!session) reject("No document found");
            resolve(session);
        }).catch(err=>reject(err));
    });
}

const getAllSessions = () => {
    return new Promise((resolve, reject)=>{
        sessionStore.find({}).then(sessions => {
            resolve(sessions);
        }).catch(err=>{
            reject(err);
        }); 
    });
}

module.exports = {
    addSession,
    deleteSession,
    updateSession,
    getAllSessions,
    getSession
};