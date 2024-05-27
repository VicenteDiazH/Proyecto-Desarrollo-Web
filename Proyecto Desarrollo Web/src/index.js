import express, { urlencoded } from 'express';
import router from './routes/index.routes.js';
import userRouter from './routes/user.routes.js';
import productRouter from './routes/products.routes.js';
import mongoose from 'mongoose';
import {engine} from "express-handlebars";
import producto from './models/productos.model.js';
import path from 'path';
import flash from "connect-flash";
import session from 'express-session';
import { fileURLToPath } from 'url';
import passport from 'passport';
import './config/passport.js';

const app =express();
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
mongoose.connect('mongodb://localhost/proyectoWeb',
).then(db=>console.log('Database is connected to','mongodb://localhost/proyectoWeb'));
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
app.use(router);
app.use(productRouter);
app.use(userRouter);

app.engine("handlebars",engine());
app.set('view engine','handlebars');
app.set('views', path.resolve(__dirname +'/views'));



app.use("/",express.static(__dirname + "/public"));




console.log(producto);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000,()=>{
    console.log('server on port 3000');
})
