<template>
    <div>
        <mt-header title="TP_LINK商城"></mt-header>
        <div id="user">
            <div><img src="../assets/img/tabbar/user.png" alt=""></div>
            <div v-text='uname' class="user"></div>
        </div>
        <mt-navbar v-model="selected">
            <mt-tab-item id="product">购物车商品</mt-tab-item>
             <mt-tab-item id="fuwu">用户客服</mt-tab-item>
              <mt-tab-item id="order">订单详情</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="selected" swipeable>
            <mt-tab-container-item id="product">
                <div class="product">
                    <ul v-for="(item,index) of c_product" :key="index">
                        <li><img :src="item.src" alt=""></li>
                        <li v-text="item.title"></li>
                    </ul>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="fuwu">
                <p class="phone">TP_LINK商城24小时热线：80808880</p>
            </mt-tab-container-item>
                  <mt-tab-container-item id="order">
                <p class="phone">您还未下单，快去商城里逛逛</p>
            </mt-tab-container-item>
        </mt-tab-container>
        <tabbar :active="active"></tabbar>
    </div>
</template>

<script>
import Tabbar from  '../components/Tabbar';
import {mapState} from 'vuex';
export default {
    computed:{
      ...mapState(['uname'])
    },
    data(){
        return{
            active:'user',
            selected:"product",
            c_product:[]
        }
    },
    mounted(){
            this.axios.get('/car/c_product',{params:{uid:sessionStorage.getItem('uid')}}).then(res=>{
                // console.log(res.data)
                for(var p of res.data){
                    p.src=require('../assets/'+p.src);
                    this.c_product.push(p)
                }
            })
    },
    components:{
        Tabbar
    }
}
</script>

<style>
.mint-header{
    background: #333;
    height:45px;
    font-size:14px;
}
#user{
      background:#d9d9d9;
      height:100px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
}
#user>:first-child{
    width: 75px;
    height:75px;
    overflow: hidden;
    background: gray;
    border-radius: 50%;
}
.user{
    font-size: 14px;
    color: #333;
}
.mint-navbar .mint-tab-item.is-selected{
    border-bottom: 2.5px solid #333;
    color: #333;
}
.mint-tab-item{
    color: grey;
}
ul{
    list-style: none;
}
.product{
    margin-bottom: 55px;
    min-height: 300px;
}
.product>ul{
    display: flex;
    height: 100px;
    box-sizing: border-box;
    overflow: hidden;
    border-bottom:1px solid #333 ;
}
.product>ul>li{
    line-height: 100px;
    font-size: 15px;
    text-overflow:ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.product>ul>li>img{
    width: 45%;
}
.phone{
    height: 50px;
    line-height: 50px;
    font-size: 15px;
    min-height: 300px;
}
</style>