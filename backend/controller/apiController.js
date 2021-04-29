require("dotenv").config();
const commentController = require("./commentController");
const postController = require("./postController");

const Pusher = require("pusher");

const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: process.env.cluster,
    useTLS: true
});

const addComment = async (req, res) => {
    let comment = req.body;
    commentController.addComment(comment).then(async (response) => {
        if (response.replied_to) {
            await commentController.updateComment({
                _id: response.replied_to
            }, {
                $push: {
                    replies: response._id
                }
            });
        }
        pusher.trigger("comments", "addComment", {
            data: response
        });
        res.json({
            message: "Done"
        });
    }).catch(err => {
        res.json({
            message: err
        });
    });
}

const deleteComment = async (req, res) => {
    let {
        comment_id,
        user_id
    } = req.body;
    commentController.deleteComment({
        _id: comment_id,
        user: user_id
    }).then(async (response) => {
        pusher.trigger("comments", "deleteComment", {
            data: req.body
        });
        if (response.replied_to) {
            await commentController.updateComment({
                replies: response._id
            }, {
                $pull: {
                    replies: response._id
                }
            });
        }
        else{
            await Promise.all(response.replies.map(id => {
                return commentController.deleteComment({
                    _id: id
                });
            }));
        }
        res.json({
            code: 200,
            message: "Comment deleted succesfully"
        });
    }).catch(err => {
        res.json({
            code: 200,
            message: err
        });
    });
}

const updateComment = async (req, res) => {
    let {
        comment_id,
        user_id,
        text
    } = req.body;
    let type = req.params.type;
    let comment = await commentController.getComment({
        _id: comment_id
    });
    if (type === 'like'){
        if (comment.likes.includes(user_id)){
            comment.likes.splice(comment.likes.indexOf(user_id), 1);
        }
        else{
            if (comment.dislikes.includes(user_id)){
                comment.dislikes.splice(comment.dislikes.indexOf(user_id), 1);
            }
            comment.likes.push(user_id);
        }
        comment.save((err, comment)=>{
            if (!err)
                res.json({
                    message: "Done"
                });
            else
                res.json({
                    message: err
                });
        });
    }
    if (type === 'dislike'){
        if (comment.dislikes.includes(user_id)){
            comment.dislikes.splice(comment.dislikes.indexOf(user_id), 1);
        }
        else{
            if (comment.likes.includes(user_id)){
                comment.likes.splice(comment.likes.indexOf(user_id), 1);
            }
            comment.dislikes.push(user_id);
        }
        comment.save((err, comment)=>{
            if (!err)
                res.json({
                    message: "Done"
                });
            else
                res.json({
                    message: err
                });
        });
    }
    else if (type === 'updateText'){
        commentController.updateComment({
            _id: comment_id,
            user: user_id
        }, {
            text
        }).then(response => {
            res.json({
                message: "Done"
            });
        }).catch(err => {
            res.json({
                message: err
            });
        });
    }
    pusher.trigger("comments", "updateComment", {
        data: req.body,
        type
    });
}

const getComments = async (req, res) => {
    let user_id = req.params.id;
    let post_id = req.params.post_id;
    commentController.getComments(post_id).then(async (response) => {
        let likes = [];
        let dislikes = [];
        if (user_id) {
            likes = await commentController.getUserLikes(user_id);
            dislikes = await commentController.getUserDislikes(user_id);
            likes = likes.map(like => like._id);
            dislikes = dislikes.map(dislike => dislike._id);
        }
        res.json({
            comments: response,
            likes,
            dislikes
        });
    }).catch(err => {
        res.json(err);
    });
}

const addPost = async (req, res) => {
    let post = req.body;
    postController.addPost(post).then(response => {
        res.json({
            code: 200,
            data: response,
            message: "Post added successfully"
        });
    }).catch(err => {
        res.json({
            code: 403,
            message: err
        });
    });
}

const getPost = async (req, res) => {
    let whereClause = req.body;
    postController.getPost(whereClause).then(response => {
        res.json({
            code: 200,
            data: response,
            message: "Fetched post successfully"
        });
    }).catch(err => {
        res.json({
            code: 404,
            message: err
        });
    });
}

const deletePost = async (req, res) => {
    let whereClause = req.body;
    postController.deletePost(whereClause).then(response => {
        res.json({
            code: 200,
            message: `${response} number of posts deleted`
        });
    }).catch(err => {
        res.json({
            code: 404,
            message: err
        });
    });
}

module.exports = {
    addComment,
    deleteComment,
    updateComment,
    getComments,
    addPost,
    getPost,
    deletePost
};