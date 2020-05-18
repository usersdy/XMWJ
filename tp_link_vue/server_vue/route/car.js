const express=require("express");
const router=express.Router();
const pool=require("../pool");

router.get('/car',(req,res)=>{
    var uid=req.query.uid;
    // console.log(uid)
    // var sql="select c.cid,p.title,p.price,p.src from shop_car as c,tplink_product as p where p.pid=c.pid and c.uid=?";
    var sql="select  c.cid,c.uid,c.cid,p.title,p.src from shop_car as c,tplink_product as p where p.pid=c.pid and c.uid=?";
    pool.query(sql,[uid],(err,result)=>{
        if(err) throw err 
        res.writeHead(200,{
            "Content-Type":"application/json,charset=uft-8",
            "Access-Control-Allow-Origin":"*"
        })
        res.write(JSON.stringify(result))
        res.end()
    })
});
router.get('/c_product',(req,res)=>{
    var uid=req.query.uid;
    // console.log(uid)
    // var sql="select c.cid,p.title,p.price,p.src from shop_car as c,tplink_product as p where p.pid=c.pid and c.uid=?";
    var sql="select  c.num,c.cid,p.title,p.src,p.price from shop_car as c,tplink_product as p where p.pid=c.pid and c.uid=?";
    pool.query(sql,[uid],(err,result)=>{
        if(err) throw err 
        res.writeHead(200,{
            "Content-Type":"application/json,charset=uft-8",
            "Access-Control-Allow-Origin":"*"
        })
        res.write(JSON.stringify(result))
        res.end()
    })
})

router.get('/delete_product',(req,res)=>{
    var uid=req.query.uid;
    var cid=req.query.cid;
    var sql=`delete from shop_car where uid=? and cid=?`;
    pool.query(sql,[uid,cid],(err,result)=>{
        if(err) throw err ;
        res.writeHead(200,{
            "Content-Type":"application/json,charset=uft-8",
            "Access-Control-Allow-Origin":"*"
        })
        if(result.affectedRows>0){
            res.write(JSON.stringify({code:1,msg:"删除成功"}))
        }else{
            res.write(JSON.stringify({code:0,msg:"删除失败"}))
        }
        res.end();
    })

})

router.post('/pAdd',(req,res)=>{
    var obj=req.body;
    console.log(obj);
    var sql='insert into shop_car set ?';
    pool.query(sql,[obj],(err,result)=>{
        if(err) throw err;
        res.writeHead(200,{
            "Content-Type":"application/json,charset=uft-8",
            "Access-Control-Allow-Origin":"*"
        });
        if(result.affectedRows>0){
            console.log(result)
            res.write(JSON.stringify({code:1,msg:'添加成功'}));
            res.end();
        }else{
            res.write(JSON.stringify({code:0,msg:'添加失败'}));
            res.end();
        };
    });
});
module.exports=router;