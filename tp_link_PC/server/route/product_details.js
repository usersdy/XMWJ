const express=require("express");
const router=express.Router();
const pool=require("../pool");

router.get('/',(req,res)=>{   
    $pid=req.query.pid;
    var product,picture,detial_picture,recommend;
    var obj={product,picture,detial_picture,recommend};
    var sql=`select title,details,address,price,isAvailable  from tplink_product where pid=?`;
    var sql1=`select*from tplink_product_picture where pid=?`;
    var sql2=`select*from tplink_product_detial_picture where pid=?`;
    //相关推荐
    var sql3=`select src,title,pid,price from tplink_product limit ${2*(Math.floor(Math.random()*13))},2`;
    Promise.all([
         new Promise(function(open){
            pool.query(sql,[$pid],(err,result)=>{
                 if(err) throw err;
                 obj.product=result[0];
                 open()
            })
         }),
         new Promise(function(open){
            pool.query(sql1,[$pid],(err,result)=>{
                if(err) throw err;
                obj.picture=result;
                open()
            })
        }),
        new Promise(function(open){
            pool.query(sql2,[$pid],(err,result)=>{
                if(err) throw err;
                obj.detial_picture=result;
                open()
            })
        }),
        new Promise(function(open){
            pool.query(sql3,[$pid],(err,result)=>{
                if(err) throw err;
                obj.recommend=result;
                open()
            })
        }),
    ]).then(()=>{
        res.writeHead(200,{
            "Content-Type":"application/json;charset=utf-8",
        });
        res.write(JSON.stringify(obj))
        res.end();
    })
});



module.exports=router