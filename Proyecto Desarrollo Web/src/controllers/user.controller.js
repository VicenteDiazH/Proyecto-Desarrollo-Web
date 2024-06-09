import User from "../models/user.model.js";
import passport from "passport";


export const renderRegister = (req, res) => {
  res.render("register");
};

export const renderMiCuenta = (req, res) => {
  const user = req.user;
  res.render("miCuenta",{wallet: user.wallet});
};




export const register = async (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  const errors = [];
  if (password != confirm_password) {
    errors.push({ text: "Password do not match." });
  }
  if (password.length < 4) {
    errors.push({ text: "Password must be at 4 characters." });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
    });
  } else {
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "This email is already in use");
      res.redirect("register");
    } else {
      const newUser = new User({ username, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      res.redirect("/login");
    }
  }
};

export const renderLogin = (req, res) => {
  res.render("login");
};

export const login = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/",
  failureFlash: true,
});

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
};


export const renderWallet = (req, res) => {
  res.render("wallet");
};

export const addWallet = async (req, res) => {
  const { wallet } = req.body;
  const walletNumeber=wallet;
  const user = req.user;
  user.wallet=walletNumeber*1+user.wallet;
  user.save();
  res.redirect("/miCuenta");
};