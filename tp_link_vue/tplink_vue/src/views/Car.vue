<template>
    <div>
        <mt-header title="TP_LINK商城" fixed>
            <router-link slot="left" to="/">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <ul class='shopping_car_menu_title'>
            <li>商品图片</li>
            <li>价格</li>
            <li>数量</li>
            <li>操作</li>
        </ul>
        <div class="c_P">
                <!--  -->
         <ul class='shopping_car_product' v-for="(item,index) of c_product" :key="index">
            <li>
                <img :src="item.src">
            </li>
            <li class="price" v-text="`￥${item.price}`"></li>
            <li v-text="item.num" class="num"></li>
            <li class="shanchu" @click="shangchu(index,item.cid)">删除</li>
        </ul>
                <!--  -->
        </div>
        <div class="to_get">
            <div v-text="`总共：￥${getAll}`" class="price"></div>
            <button>去结算</button>
        </div>
        <tabbar :active="active"></tabbar>
    </div>
</template>

<script>
import Tabbar from  '../components/Tabbar'
import {mapState} from 'vuex'
export default {
    computed:{
        ...mapState(['uid']),
        getAll(){
            var total=0;
            for(var p of this.c_product){
                total+=p.num*p.price
            }
            return total
        }
    },
    data(){
        return{
            active:'car',
            c_product:[],
            checked_p:[],
        }
    },
    created(){
    //  console.log(this.$router)
    // console.log(this.$route)
    },
    methods:{
        get_car_product(){
            this.axios.get('/car/c_product',{params:{uid:this.uid}}).then(res=>{
                // console.log(res.data)
                for(var p of res.data){
                    p.src=require('../assets/'+p.src);
                    this.c_product.push(p)
                }
            })
        },
        shangchu(index,cid){
            this.axios.get('/car/delete_product',{params:{uid:sessionStorage.getItem('uid'),cid:cid}}).then(res=>{
            this.c_product.splice(index,1);
              this.$toast({
                        message:'删除成功',
                        position:'middle',
                        duration:500
                     });
            })
     
        }
    },
    mounted(){
        this.get_car_product()
    },
    components:{
        Tabbar
    }
}

</script>
<style scoped>
.mint-header{
    background: #333;
    height:45px;
    font-size:0.4rem;
}
.c_P{
        width: 100%;
        background: #fff;
         overflow: auto;
         margin-top:100px ;
         margin-bottom:105px;
 }
 .shopping_car_menu_title{
     display: flex;
     height: 55px;
     line-height: 55px;
     font-size: 0.4rem;
     border-bottom: 1px solid grey;
     box-sizing: border-box;
     position: fixed;
     top:45px;
     left:0px;
     width: 100%;
     background: whitesmoke;
 }
 .shopping_car_menu_title>:first-child, .shopping_car_product>:first-child{
     width: 45%;
 }
 .shopping_car_menu_title>:nth-child(2),.shopping_car_product>:nth-child(2){
     width: 25%;
 }
 .shopping_car_menu_title>:nth-child(3),.shopping_car_product>:nth-child(3){
        width:15% ;
 }
.shopping_car_menu_title>:nth-child(4),.shopping_car_product>:nth-child(4){
    width: 15%;
}
 .shopping_car_product{
     display: flex;
     width: 100%;
     height: 100px;
     box-sizing: border-box;
     border-bottom: 1px solid grey;
 }
.shopping_car_product img{
    width:88px;
    max-width: 120px;
}
.shopping_car_product>li{
    height: 100px;
    line-height: 100px;
}
.price{
    color: red;
    font-size: 14px;
}
.shanchu{
     font-size: 14px;
}
.shanchu:active{
    color: red;
}
.to_get{
    position: fixed;
    width: 100%;
    bottom: 55px;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    line-height: 50px;
    box-sizing: border-box;
    background:whitesmoke;
    align-items: center;
    padding-right: 15px;
}
.to_get>button{
    background: red;
    color: #fff;
    font-size: 16px;
    outline: 0;
    border: 0;
    width: 25%;
    height: 40px;
    border-radius: 5px;
    margin-left: 10px;
    max-width: 150px;
}
ul{
    list-style: none;
}
.price{
    font-size: 16px;
    color: red;
}
.num{
    font-size: 14px;
}
    </style>