let syncer = async () => {
    let post_id = document.body.getAttribute("post-id");
    let commentDb = await idb('demoDb', 'commentStore');
    const addComment = async (comment) => {
        let obj = await commentDb.add(comment);
        if (obj.replied_to) {
            let comment = await commentDb.get(obj.replied_to);
            comment.replies.push(obj._id);
            await commentDb.put(comment);
        }
        if (comment.post === post_id)
            renderComment(comment);
    }
    const getComments = async (post) => {
        let comments = await commentDb.getAll(post);
        if (post === post_id)
            comments.forEach(comment => {
                renderComment(comment);
            });
    }
    const removeComment = async (obj) => {
        let comment = await commentDb.get(obj.comment_id);
        if (comment.user === obj.user_id) {
            comment = await commentDb._delete(obj.comment_id);
            if (comment.replied_to){
                let parent = await commentDb.get(comment.replied_to);
                parent.replies.splice(parent.replies.indexOf(comment._id), 1);
                await commentDb.put(parent);
            }
            else{
                await Promise.all(comment.replies.map(reply_id => {
                    return commentDb._delete(reply_id);
                }));
            }
            if (comment.post === post_id)
                deleteComment(comment._id);
        }
    }
    const updateComment = async (type, obj) => {
        const updateLike = (comment, obj) => {
            let {
                user_id
            } = obj;
            let inLike = comment.likes.indexOf(user_id);
            let inDislike = comment.dislikes.indexOf(user_id);
            if (inLike > -1){
                comment.likes.splice(inLike, 1);
            }
            else{
                if (inDislike > -1){
                    comment.dislikes.splice(inDislike, 1);
                }
                comment.likes.push(user_id);
            }
            return comment;
        }
        const updateDislike = (comment, obj) => {
            let {
                user_id
            } = obj;
            let inLike = comment.likes.indexOf(user_id);
            let inDislike = comment.dislikes.indexOf(user_id);
            if (inDislike > -1){
                comment.dislikes.splice(inDislike, 1);
            }
            else{
                if (inLike > -1){
                    comment.likes.splice(inLike, 1);
                }
                comment.dislikes.push(user_id);
            }
            return comment;
        }
        const updateText = (comment, obj) => {
            if (comment.user === obj.user_id) {
                comment.text = obj.text;
            }
            return comment;
        }
        let comment = await commentDb.get(obj.comment_id);
        var updatedComment;
        if (type === 'like')
            updatedComment = updateLike(comment, obj);
        else if (type === 'dislike')
            updatedComment = updateDislike(comment, obj);
        else if (type === 'updateText')
            updatedComment = updateText(comment, obj);
        await commentDb.put(updatedComment);
        if (updatedComment.post === post_id)
            changeComment(updatedComment);
    }
    return {
        addComment,
        getComments,
        removeComment,
        updateComment
    }
}