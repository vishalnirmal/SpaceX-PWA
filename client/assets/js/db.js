var pusher = new Pusher('a0bb0789ce81155a04dc', {
    cluster: 'ap2'
});

var channel = pusher.subscribe('comments');
channel.bind('addComment', function (data) {
    let comment = data.data;
    rComment(comment);
});
channel.bind('updateComment', function (data) {
    let comment = data.data;
    uComment(comment);
});
channel.bind('addLike', function (data) {
    let comment = data.data;
    uComment(comment);
});
channel.bind('removeLike', function (data) {
    let comment = data.data;
    uComment(comment);
});
channel.bind('addDislike', function (data) {
    let comment = data.data;
    uComment(comment);
});
channel.bind('removeDislike', function (data) {
    let comment = data.data;
    uComment(comment);
});
channel.bind('deleteComment', function (data) {
    deleteComment(data.comment_id);
});

const getComments = () => {
    let user_id = document.body.getAttribute("user-id");
    let post_id = document.body.getAttribute("post-id");
    let url = "/api/comments/getComments/" + post_id;
    if (user_id)
        url += "/" + user_id;
    fetch(url).then(res => res.json()).then(res => {
        let {
            comments,
            likes,
            dislikes
        } = res;
        localStorage.setItem("likes", JSON.stringify(likes));
        localStorage.setItem("dislikes", JSON.stringify(dislikes));
        comments.forEach(comment => {
            rComment(comment);
        });
    }).catch(console.log);
}
const sendComment = (comment) => {
    let user_id = document.body.getAttribute("user-id");
    let post_id = document.body.getAttribute('post-id');
    if (user_id) {
        comment.user = user_id;
        comment.post = post_id;
        fetch("/api/comments/addComment", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(comment)
        }).catch(console.log);
    }
}
const updateComment = (comment, type) => {
    let user_id = document.body.getAttribute("user-id");
    if (user_id) {
        comment.user_id = user_id;
        fetch("/api/comments/" + type, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(comment)
        }).catch(console.log);
    }
}
const updateCommentText = (comment) => {
    let user_id = document.body.getAttribute("user-id");
    if (user_id) {
        comment.user_id = user_id;
        fetch("/api/comments/updateComment", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(comment)
        }).catch(console.log);
    }
}
getComments();