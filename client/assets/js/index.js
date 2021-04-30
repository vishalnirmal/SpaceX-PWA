var socket = io.connect();
let timestamp = localStorage.getItem('timestamp');

function updateTimestamp(timestamp) {
    localStorage.setItem('timestamp', timestamp);
}
if (timestamp) {
    socket.emit('login', {
        timestamp
    });
} else {
    socket.emit('register');
}
syncer().then(async (res) => {
    await res.getComments(document.body.getAttribute("post-id")).catch(console.log);
    socket.on('sync', async (transactions) => {
        await Promise.all(transactions.map(transaction => {
            if (transaction.mode === 'add') {
                updateTimestamp(transaction.timestamp);
                return res.addComment(transaction.data);
            } else if (transaction.mode === 'delete') {
                updateTimestamp(transaction.timestamp);
                return res.removeComment(transaction.data);
            } else if (transaction.mode === 'update') {
                updateTimestamp(transaction.timestamp);
                return res.updateComment(transaction.data.type, transaction.data.data);
            }
        })).catch(console.log);
    });
    socket.on('addComment', (data) => {
        updateTimestamp(data.timestamp);
        let comment = data.data;
        res.addComment(comment);
    });
    socket.on('deleteComment', (data) => {
        updateTimestamp(data.timestamp);
        res.removeComment(data.data);
    });
    socket.on('updateComment', (data) => {
        updateTimestamp(data.timestamp);
        res.updateComment(data.type, data.data);
    });
}).catch(console.log);

// const getComments = () => {
//     let user_id = document.body.getAttribute("user-id");
//     let post_id = document.body.getAttribute("post-id");
//     let url = "/api/comments/getComments/" + post_id;
//     if (user_id)
//         url += "/" + user_id;
//     fetch(url).then(res => res.json()).then(res => {
//         let {
//             comments,
//             likes,
//             dislikes
//         } = res;
//         localStorage.setItem("likes", JSON.stringify(likes));
//         localStorage.setItem("dislikes", JSON.stringify(dislikes));
//         comments.forEach(comment => {
//             renderComment(comment);
//         });
//     }).catch(console.log);
// }
const sendComment = async (comment) => {
    let db = await syncer().catch(console.log);
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
        fetch("/api/comments/updateComment/" + type, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(comment)
        }).catch(console.log);
    }
}
const deleteCommentFromDb = (comment) => {
    let user_id = document.body.getAttribute("user-id");
    if (user_id) {
        comment.user_id = user_id;
        fetch("/api/comments/deleteComment", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(comment)
        }).catch(console.log);
    }
}
// getComments();