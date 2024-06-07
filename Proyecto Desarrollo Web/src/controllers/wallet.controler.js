const Wallet = require('../models/wallet.model');

exports.getBalance = async (req, res) => {
    try {
        const balance = await Wallet.getBalance();
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving balance', error });
    }
};

exports.addFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        await Wallet.addFunds(amount);
        const balance = await Wallet.getBalance();
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ message: 'Error adding funds', error });
    }
};

exports.withdrawFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        const success = await Wallet.withdrawFunds(amount);
        if (success) {
            const balance = await Wallet.getBalance();
            res.json({ balance });
        } else {
            res.status(400).json({ message: 'Insufficient funds' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error withdrawing funds', error });
    }
};
