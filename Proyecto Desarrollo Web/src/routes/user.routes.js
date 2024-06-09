import {Router} from "express";
import {renderRegister,renderLogin ,register,login,renderMiCuenta} from "../controllers/user.controller.js";

const router= Router();
router.get("/register",renderRegister);

router.post('/register',register);
router.get("/login",renderLogin);
router.post('/login',login);
router.get("/miCuenta",renderMiCuenta);

export default router;