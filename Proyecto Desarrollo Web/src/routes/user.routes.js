import { Router } from "express";
import { renderRegister, renderLogin, renderMiCuenta, renderWallet, addWallet, logout, } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js"
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/register", renderRegister);

router.post('/register', async (req, res) => {
    const { username, email, password, confirm_password } = req.body;
    const errors = [];

    if (!username || !email ) {
    return res.status(400).json({
        message: "Bad Request",
        success: false,
    })
    }

    if (password != confirm_password) {
    return res.status(400).json({
        message: "Bad Request: Password do not match.",
        success: false,
    })
    }

    if (password.length < 4) {
    return res.status(400).json({
        message: "Bad Request: Password must be at 4 characters.",
        success: false,
    })
    }

    if (errors.length > 0) {
    return res.json({
        success: false,
    });
    } else {
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
        return res.json({
        message: "This email is already in use",
        success: false,
        });
    } else {
        const newUser = new User({ username, email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        return res.json({
            success: true,
        });
    }
    }
});

router.get("/login", renderLogin);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password ) {
      return res.status(400).json({
        message: "Bad Requestas",
        success: false,
      });
    }
  
    const dbUser = await User.findOne({ email });
  
    if (!dbUser){
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }
  
    if(!bcrypt.compareSync(password, dbUser.password)) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }
  
    const token = jwt.sign({ id: dbUser.id, role: dbUser.isAdmin }, "secret", {
      expiresIn: "1h",
    });
  
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
  
    return res.json({
      success: true,
      jwt: token
    });
});

router.get("/miCuenta", isAuthenticated, renderMiCuenta);

router.get("/wallet", isAuthenticated, renderWallet);

router.post('/addWallet', isAuthenticated, addWallet);

router.get('/logout', logout);

export default router;