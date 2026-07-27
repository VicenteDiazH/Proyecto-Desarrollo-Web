import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import 'dotenv/config';
import express, { urlencoded } from 'express';
import userRouter from './routes/user.routes.js';
import productRouter from './routes/products.routes.js';
import cartRouter from "./routes/cart.routes.js"
import mongoose from 'mongoose';
import { engine } from "express-handlebars";
import path from 'path';
import flash from "connect-flash";
import session from 'express-session';
import { fileURLToPath } from 'url';
import passport from 'passport';
import './config/passport.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado exitosamente'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    if (req.user) {
        const userObj = req.user.toObject ? req.user.toObject() : req.user;
        userObj.isAdmin = req.user.role === 'ADMIN';
        res.locals.user = userObj;
    } else {
        res.locals.user = null;
    }
    next();
});

app.engine("handlebars", engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname + '/views'));

app.use("/static",express.static(__dirname + "/public"));

app.use(productRouter);
app.use(userRouter);
app.use(cartRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server on port ' + PORT);
})
