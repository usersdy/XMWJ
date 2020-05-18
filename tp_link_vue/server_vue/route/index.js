const express=require("express")
const router=express.Router()
const pool=require("../pool");

//头部推荐下拉图片
router.get('/show_product',(req,res)=>{
    var obj={domestic:[],commercial:[],defend:[]}
    var sql="select*from tplink_show_product where described=?";
    var sql1="select*from tplink_show_product where described=?";
    var sql2="select*from tplink_show_product where described=?";
   Promise.all([
       new Promise(function(open){
        pool.query(sql,["domestic"],(err,result)=>{
            if(err) throw err;
            obj.domestic=result;
            open()
        });
       }),
       new Promise(function(open){
        pool.query(sql1,["commercial"],(err,result)=>{
            if(err) throw err;
            obj.commercial=result;
            open()
        });
    }),
    new Promise(function(open){
        pool.query(sql2,["defend"],(err,result)=>{
            if(err) throw err;
            obj.defend=result;
            open()
        });
    })
   ]).then(()=>{
    res.writeHead(200,{
        "Content-Type":"application/json;charset=utf-8",
    });
    res.write(JSON.stringify(obj))
    res.end();
   });
});


//轮播图;
router.get('/banner',(req,res)=>{
    var sql='select src,href from banner';
    pool.query(sql,[],(err,result)=>{
        if(err) throw err;
        res.writeHead(200,{
            "Content-Type":"application/json;charset=utf-8",
        });
        res.write(JSON.stringify(result))
        res.end();
    })
})

//商品列表
router.get('/product',(req,res)=>{
    var sql=`select*from tplink_product`;
    pool.query(sql,(err,result)=>{
     if(err) throw err ;
         res.writeHead(200,{
        "Content-Type":"application/json;charset=utf-8",
    });
    res.write(JSON.stringify(result))
    res.end();   
 })
       
  
     
});
module.exports=router;