import User from "../models/user.model.js";

export const renderRegister = (req, res) => {
  res.render("register");
};

export const renderMiCuenta = (req, res) => {
  const user = req.user;
  res.render("miCuenta",{wallet: user.wallet});
};

export const renderLogin = (req, res) => {
  res.render("login");
};

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
try{
    const { wallet } = req.body;
    const walletNumeber=wallet;
    const user = req.user;
  user.wallet=walletNumeber*1+user.wallet;
  user.save();
  res.json({
    success: true
})
} catch (error) {
  res.json({
    success: false
})
}

};