const express=require('express');
const app=express();
app.listen(3030);

const user=require('./route/user');
const index=require('./route/index');
const car=require('./route/car');
const product=require('./route/product');
const bodyParser=require('body-parser');
const product_dttails=require('./route/product_details')
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended:false
}));

 
const cors=require("cors");
//使用CORS模块
app.use(cors({
    origin:'*',
}));
app.use('/user',user);
app.use('/index',index);
app.use('/car',car);
app.use('/product',product);
app.use('/product_details',product_dttails);