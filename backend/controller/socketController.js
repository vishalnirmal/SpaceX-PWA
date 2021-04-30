const transactionController = require('./transactionController');
const commentController = require('./commentController');


const register = (socket) => {
    commentController.getComments().then(comments => {
        let transactions = comments.map(comment => {
            return {
                mode: 'add',
                data: comment,
                data_id: comment._id,
                timestamp: Date.now()
            };
        });
        socket.emit('sync', transactions);
    }).catch(console.log);
}

const login = async (socket, data) => {
    transactionController.getTransactions(data.timestamp).then(transactions => {
        socket.emit('sync', transactions);
    });
}

const createServer = (server) => {
    const io = require('socket.io')(server);
    io.on('connection', async (socket) => {
        socket.on('register', _ => register(socket));
        socket.on('login', data => login(socket, data));
    });
    return io;
}
module.exports = {
    createServer
};