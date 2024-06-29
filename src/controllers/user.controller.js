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

export const renderWallet = async (req, res) => {
    try {
      const userId = req.user.id;
      const wallet = await walletModel.findOne({ user: userId }).lean();
      return res.json({
        success: true,
        wallet,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
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