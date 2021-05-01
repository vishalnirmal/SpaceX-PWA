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
        for (let i = 0; i < transactions.length; i++) {
            let transaction = transactions[i];
            if (transaction.mode === 'add') {
                updateTimestamp(transaction.timestamp);
                await res.addComment(transaction.data).catch(console.log);
            } else if (transaction.mode === 'delete') {
                updateTimestamp(transaction.timestamp);
                await res.removeComment(transaction.data).catch(console.log);
            } else if (transaction.mode === 'update') {
                updateTimestamp(transaction.timestamp);
                await res.updateComment(transaction.data.type, transaction.data.data).catch(console.log);
            }
        }
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

const sendComment = async (comment) => {
    let user_id = document.body.getAttribute("user-id");
    let post_id = document.body.getAttribute('post-id');
    if (user_id) {
        comment.user = user_id;
        comment.post = post_id;
        let commentDb = await syncer();
        let transactionDb = await idb('spacexDb', 'transactionStore');
        await commentDb.addComment(comment).catch(console.log);
        let transaction = {
            url: "/api/comments/addComment",
            data: comment,
            timestamp: Date.now()
        }
        await transactionDb.add(transaction);
        uploadComment();
    }
}
const updateComment = async (comment, type) => {
    let user_id = document.body.getAttribute("user-id");
    if (user_id) {
        comment.user_id = user_id;
        let url = "/api/comments/updateComment/" + type;
        let commentDb = await syncer();
        let transactionDb = await idb('spacexDb', 'transactionStore');
        await commentDb.updateComment(type, comment).catch(console.log);
        let transaction = {
            url,
            data: comment,
            timestamp: Date.now()
        }
        await transactionDb.add(transaction).catch(console.log);
        uploadComment();
    }
}
const deleteCommentFromDb = async (comment) => {
    let user_id = document.body.getAttribute("user-id");
    if (user_id) {
        comment.user_id = user_id;
        let commentDb = await syncer();
        let transactionDb = await idb('spacexDb', 'transactionStore');
        await commentDb.removeComment(comment).catch(console.log);
        let transaction = {
            url: "/api/comments/deleteComment",
            data: comment,
            timestamp: Date.now()
        }
        await transactionDb.add(transaction).catch(console.log);
        uploadComment();
    }
}

const uploadComment = () => {
    navigator.serviceWorker.ready.then(registration => {
        if ('SyncManager' in window) {
            registration.sync.register('sync-comments').then(_ => {}).catch(err => {
                console.log("Error in registering background sync");
            })
        } else {
            if (navigator.onLine) {
                syncFallback();
            }
        }
    });
}

const syncFallback = async () => {
    let transactionStore = await idb('spacexDb', 'transactionStore');
    let repeat = setInterval(async () => {
        let transactions = await transactionStore.getTxns().catch(console.log);
        let i = 0;
        for (i = 0; i < transactions.length; i++) {
            let transaction = transactions[i];
            try {
                await fetch(transaction.url, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(transaction.data)
                });
                await transactionStore._delete(transaction._id).catch(console.log);
            } catch (err) {
                break;
            }
        }
        if (i === transactions.length)
            clearInterval(repeat);
    }, 1000);
}

window.ononline = (e) => {
    if (!window.SyncManager) {
        syncFallback();
    }
}