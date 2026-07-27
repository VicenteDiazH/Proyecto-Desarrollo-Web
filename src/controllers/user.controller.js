import User from "../models/user.model.js";
import passport from "passport";


export const renderRegister = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/miCuenta");
  }
  res.render("register");
};

export const renderMiCuenta = (req, res) => {
  const user = req.user;
  res.render("miCuenta", {
    wallet: user.wallet,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture || '/static/Design/ProfileCharly.png',
    isAdmin: user.role === 'ADMIN'
  });
};




export const register = async (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  const errors = [];

  if (!username || !email || !password || !confirm_password) {
    errors.push({ text: "Por favor, completa todos los campos." });
  }
  if (password !== confirm_password) {
    errors.push({ text: "Las contraseñas no coinciden." });
  }
  if (password && password.length < 4) {
    errors.push({ text: "La contraseña debe tener al menos 4 caracteres." });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      username,
      email,
    });
  } else {
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      req.flash("error_msg", "Este correo ya está registrado.");
      res.redirect("/register");
    } else {
      const newUser = new User({ username, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "Registro exitoso. Ahora puedes iniciar sesión.");
      res.redirect("/login");
    }
  }
};

export const renderLogin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("login");
};

export const login = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/",
  failureFlash: true,
});
export const logout = (req, res, next) => {
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
  try {
    const { wallet } = req.body;
    const amount = Number(wallet);
    if (isNaN(amount) || amount <= 0) {
      req.flash('error_msg', 'Ingresa un monto válido mayor a 0');
      return res.redirect("/wallet");
    }
    const user = req.user;
    user.wallet = (user.wallet || 0) + amount;
    await user.save();
    req.flash('success_msg', 'Dinero añadido correctamente a tu wallet');
    res.redirect("/miCuenta");
  } catch (error) {
    console.error("Error al añadir dinero:", error);
    req.flash('error_msg', 'Error al añadir dinero a la wallet');
    res.redirect("/wallet");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { username, profilePicture } = req.body;

    if (username && username.trim() !== '') {
      user.username = username.trim();
    }
    if (profilePicture && profilePicture.trim() !== '') {
      user.profilePicture = profilePicture.trim();
    }

    await user.save();
    req.flash('success_msg', 'Perfil actualizado correctamente');
    res.redirect('/miCuenta');
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    req.flash('error_msg', 'Error al actualizar el perfil');
    res.redirect('/miCuenta');
  }
};