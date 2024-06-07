const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
});

const Wallet = mongoose.model('Wallet', walletSchema);

exports.getBalance = async () => {
    const wallet = await Wallet.findOne();
    return wallet ? wallet.balance : 0;
};

exports.addFunds = async (amount) => {
    let wallet = await Wallet.findOne();
    if (!wallet) {
        wallet = new Wallet();
    }
    wallet.balance += amount;
    await wallet.save();
};

exports.withdrawFunds = async (amount) => {
    let wallet = await Wallet.findOne();
    if (!wallet || wallet.balance < amount) {
        return false;
    }
    wallet.balance -= amount;
    await wallet.save();
    return true;
};
