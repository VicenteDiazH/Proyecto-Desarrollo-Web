import express, { urlencoded } from 'express';
import userRouter from './routes/user.routes.js';
import productRouter from './routes/products.routes.js';
import cartRouter from "./routes/cart.routes.js";
import receiptRouter from "./routes/receipts.routes.js";
import mongoose from 'mongoose';
import {engine} from "express-handlebars";
import path from 'path';
import flash from "connect-flash";
import session from 'express-session';
import { fileURLToPath } from 'url';
import passport from 'passport';
import './config/passport.js';
import cookieParser from "cookie-parser";


const app =express();
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
mongoose.connect('mongodb+srv://VicenteDiazH:Ur8GMVqW31uGcEbX@cluster0.snhc1rx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
);
console.log(__dirname);
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req,res,next)=>{
   res.locals.succes_msg=req.flash('succes_msg');
   res.locals.error_msg=req.flash('error_msg');
   res.locals.user=req.user||null;
   next();    
});



app.engine("handlebars",engine());
app.set('view engine','handlebars');
app.set('views', path.resolve(__dirname +'/views'));

app.use(cookieParser());

app.use(productRouter);
app.use(userRouter);
app.use(cartRouter);
app.use(receiptRouter);


app.use("/static",express.static(__dirname + "/public"));







app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000,()=>{
    console.log('server on port 3000');
})
