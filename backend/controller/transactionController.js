const Transaction = require('../model/transaction');

const addTransaction = async (mode, data, data_id) => {
    return new Promise(async (resolve, reject) => {
        let transaction = {
            data_id,
            data,
            mode
        };
        if (mode === 'delete') {
            await Transaction.deleteMany({
                data_id,
                mode: "update"
            });
        }
        Transaction.create(transaction).then(transaction => {
            if (!transaction)
                reject("Unable to create transaction");
            resolve(transaction);
        }).catch(reject);
    });
}

const getTransactions = async (timestamp) => {
    return new Promise((resolve, reject) => {
        Transaction.find({
            timestamp: {
                $gt: timestamp
            }
        }).then(transactions => {
            resolve(transactions);
        }).catch(reject);
    });
}

module.exports = {
    addTransaction,
    getTransactions
};