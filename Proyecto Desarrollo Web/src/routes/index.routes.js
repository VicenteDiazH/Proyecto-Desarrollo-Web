
import {Router} from 'express';
const router =Router();

router.get('/',(req,res)=>{
   
    res.render('home');
});

router.get('/albumPages',(req,res)=>{
    res.render('albumPages');
});


export default router;