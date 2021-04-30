const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    timestamp: {
        type: Number,
        default: () => Date.now()
    },
    data_id: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;