import {Router} from "express";
import {renderRegister,renderLogin ,register,login} from "../controllers/user.controller.js";

const router= Router();
router.get("/register",renderRegister);
router.post('/register',register);
router.get("/login",renderLogin);
router.post('/login',login);

export default router;