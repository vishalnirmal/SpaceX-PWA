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
        })
        res.json({
            message: "Done"
        })
    }).catch(err => {
        res.json({
            message: err
        });
    });
}

const deleteComment = async (req, res)=>{
    let {
        comment_id,
        user_id
    } = req.body;
    commentController.deleteComment({
        _id: comment_id,
        user: user_id
    }).then(response=>{
        pusher.trigger("comments", "deleteComment", {
            comment_id
        });
        res.json({
            code: 200,
            data: response,
            message: "Comment deleted succesfully"
        });
    }).catch(err=>{
        res.json({
            code: 200,
            message: err
        });
    });
}

const updateComment = async (req, res)=>{
    let {
        text,
        _id,
        user_id
    } = req.body;
    commentController.updateComment({
        _id,
        user: user_id
    }, {
        text
    }).then(response=>{
        pusher.trigger("comments", "updateComment", {
            data: response
        })
        res.json({
            code: 200,
            message: "Updated comment successfully"
        });
    }).catch(err=>{
        res.json({
            code: 404,
            message: err
        });
    });
}

const getComments = async (req, res) => {
    let user_id = req.params.id;
    let post_id = req.params.post_id;
    commentController.getComments(post_id).then(async(response)=>{
        let likes = [];
        let dislikes = [];
        if (user_id){
            likes = await commentController.getUserLikes(user_id);
            dislikes = await commentController.getUserDislikes(user_id);
            likes = likes.map(like=>like._id);
            dislikes = dislikes.map(dislike=>dislike._id);
        }
        res.json({
            comments: response,
            likes,
            dislikes
        });
    }).catch(err=>{
        res.json(err);
    });
}

const addLike = async (req, res) => {
    let {
        comment_id,
        user_id
    } = req.body;
    commentController.updateComment({
        _id: comment_id,
        likes: {
            $ne: user_id
        }
    }, {
        $push: {
            likes: user_id
        },
        $pull: {
            dislikes: user_id
        }
    }).then(response=>{
        pusher.trigger("comments", "addLike", {
            data: response
        });
        res.json({
            message: "Done"
        })
    }).catch(err=>{
        res.json({
            message: err
        });
    });
}

const removeLike = async (req, res) => {
    let {
        comment_id,
        user_id
    } = req.body;
    commentController.updateComment({
        _id: comment_id,
        likes: {
            $eq: user_id
        }
    }, {
        $pull: {
            likes: user_id
        }
    }).then(response=>{
        pusher.trigger("comments", "removeLike", {
            data: response
        });
        res.json({
            message: "Done"
        })
    }).catch(err=>{
        res.json({
            message: err
        });
    });
}

const addDislike = async (req, res) => {
    let {
        comment_id,
        user_id
    } = req.body;
    commentController.updateComment({
        _id: comment_id,
        dislikes: {
            $ne: user_id
        }
    }, {
        $push: {
            dislikes: user_id
        },
        $pull: {
            likes: user_id
        }
    }).then(response=>{
        pusher.trigger("comments", "addDislike", {
            data: response
        });
        res.json({
            message: "Done"
        })
    }).catch(err=>{
        res.json({
            message: err
        });
    });
}

const removeDislike = async (req, res) => {
    let {
        comment_id,
        user_id
    } = req.body;
    commentController.updateComment({
        _id: comment_id,
        dislikes: {
            $eq: user_id
        }
    }, {
        $pull: {
            dislikes: user_id
        }
    }).then(response=>{
        pusher.trigger("comments", "removeDislike", {
            data: response
        });
        res.json({
            message: "Done"
        })
    }).catch(err=>{
        res.json({
            message: err
        });
    });
}

const addPost = async (req, res)=>{
    let post = req.body;
    postController.addPost(post).then(response=>{
        res.json({
            code: 200,
            data: response,
            message: "Post added successfully"
        });
    }).catch(err=>{
        res.json({
            code: 403,
            message: err
        });
    });
}

const getPost = async (req, res)=>{
    let whereClause = req.body;
    postController.getPost(whereClause).then(response=>{
        res.json({
            code: 200,
            data: response,
            message: "Fetched post successfully"
        });
    }).catch(err=>{
        res.json({
            code: 404,
            message: err
        });
    });
}

const deletePost = async (req, res)=>{
    let whereClause = req.body;
    postController.deletePost(whereClause).then(response=>{
        res.json({
            code: 200,
            message: `${response} number of posts deleted`
        });
    }).catch(err=>{
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
    addLike,
    addDislike,
    removeLike,
    removeDislike,
    getComments,
    addPost,
    getPost,
    deletePost
};