import {Router} from 'express';
import {getBalance, addFunds, withdrawFunds} from '../controllers/wallet.controller.js';

const router = Router();

router.get('/wallet/balance', getBalance);
router.post('/wallet/add', addFunds);
router.post('/wallet/withdraw', withdrawFunds);

export default router;