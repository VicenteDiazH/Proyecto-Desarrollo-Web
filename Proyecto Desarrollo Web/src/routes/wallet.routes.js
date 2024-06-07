const express = require('express');
const app = express();
const walletController = require('./controllers/wallet.controller');

app.use(express.json());
app.use(express.static('public'));

app.get('/wallet/balance', walletController.getBalance);
app.post('/wallet/add', walletController.addFunds);
app.post('/wallet/withdraw', walletController.withdrawFunds);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});