const mysql=require('mysql');
var pool=mysql.createConnection({
    host:'127.0.0.1',
    port:'3306',
    user:'root',
    password:'',
    database:'tplink',
    connectionLimit:20
});
module.exports=pool;