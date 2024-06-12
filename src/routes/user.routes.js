import { Router } from "express";
import { renderRegister, renderLogin, register, login, renderMiCuenta, renderWallet, addWallet, logout, } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js"

const router = Router();
router.get("/register", renderRegister);

router.post('/register', register);
router.get("/login", renderLogin);
router.post('/login', login);
router.get("/miCuenta", isAuthenticated, renderMiCuenta);
router.get("/wallet", isAuthenticated, renderWallet);
router.post('/addWallet', isAuthenticated, addWallet);
router.get('/logout', logout);


export default router;