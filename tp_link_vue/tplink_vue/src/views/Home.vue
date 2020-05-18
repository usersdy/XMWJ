<template>
  <div id="home" >
    <mt-header title='TP_LINK商城' fixed>
         <router-link to='/user' slot="left">
            <mt-button v-text="uname"></mt-button>
         </router-link>
         <div slot="right" v-if="uname==''">
            <router-link to="/login">
                <mt-button id='dl'>登录</mt-button>
            </router-link>
            <router-link to='/register'>
                  <mt-button id='zc'>注册</mt-button>
            </router-link>
         </div>
         <div slot="right" v-else>
             <mt-button @click='logout'>
                      注销
             </mt-button>
         </div>
    </mt-header>
    <div class="search">
      <input type="text" v-model="search"><button @click="loadsearch" :disabled="search==''" :class="search==''? 'disabled':''">搜索</button>
    </div>
    <mt-swipe class='banner'>
        <mt-swipe-item v-for="(item,index) of banner" :key="index">
            <img :src="item.src" alt="" @click="detail(item.href)">
        </mt-swipe-item>
    </mt-swipe>
    <!--  -->
        <div class="main"
          infinite-scroll-distance="10"
          v-infinite-scroll="loaddata"
          infinite-scroll-disabled="busy"
          :infinite-scroll-immediate-check="true">
              <div id="products">
                    <div v-for="(elem,index) of products" :key="index" :class="index%2!=0? 'ou':''">
                        <router-link :to="`/detail/${elem.href}`">
                             <img :src="elem.src" alt="">
                            <p v-text="elem.title" class="title"></p>
                            <p v-text="`￥${elem.price}`" class='price'></p>
                        </router-link>
                    </div>
              </div>
    </div>
    <!--  -->
    <tabbar :active="active"></tabbar>
  </div>
</template>

<script>
import Tabbar from  '../components/Tabbar'
import {mapState,mapMutations} from 'vuex'
export default {
    data(){
      return{
        banner:'',
        active:'home',
        search:'',
        page:1,
        pageCount:1,
        products:[],
        busy:false,
        canSearch:true
      }
    },
      methods:{
        loadsearch(){
             if(this.canSearch&&this.search!=''){
                this.canSearch=false;
                this.page=1;
                this.$indicator.open('加载中...');
                this.axios.get('/product/product',{params:{search:this.search,page:this.page}}).then(res=>{
                this.$indicator.close();  
                this.canSearch=true
                if(res.data.data.length==0){
                  this.$toast({message:'未找到相关商品'})
                  this.search='';
                }else{
                    this.products=[];
                    this.pageCount=res.data.pageCount;
                    for(var  p of res.data.data){
                       p.src= require('../assets/'+ p.src)
                       p.href=p.href.split('=')[1]
                       this.products.push(p);
                       this.busy=false;
                       this.search=''
                    };
                }
              });
             }
        },
        loaddata(){
          this.page++;
          if(this.page<this.pageCount){
            this.busy = true;
            this.loadMore()
          }
        },
      ...mapMutations(["logout"]),
      detail(href){
        this.$router.push(`/detail/${href}`)
      },
      loadMore(){
        this.$indicator.open('加载中...');
        this.axios.get('/product/product',{params:{search:this.search,page:this.page}}).then(res=>{
        this.$indicator.close();  
        if(res.data.data.length==0){
          this.$toast({message:'未找到相关商品'})
        }else{
            this.pageCount=res.data.pageCount;
            for(var  p of res.data.data){
               p.src= require('../assets/'+ p.src)
               p.href=p.href.split('=')[1]
               this.products.push(p);
               this.busy=false
            };
        }
      });
      }
    },
    mounted(){
      this.axios.get('/index/banner').then(res=>{
         for(var r of res.data){
           r.src= require('../assets/' + r.src)
           r.href=r.href.split('=')[1]
         };
          this.banner=res.data;
      });
      this.loadMore();
    },

    computed:{
      ...mapState(['uname'])
    },
     components:{
          Tabbar
    },
}
</script>

<style  scoped>
.mint-header{
    background: #333;
    height:45px;
    font-size:0.4rem;
}
#dl,#zc{
  color: #fff!important;
}
#zc{
  margin-left: 0.5rem;
}
.banner{
  height: 160px;
}
.banner img{
  width: 100%;
  height: 160px;
}
#products{
  width: 100%;
  display: flex;
  margin-bottom: 55px;
  box-sizing: border-box;
  flex-wrap: wrap;
  padding: 10px;
}
.ou{
  margin-left: 5px;
}
#products>div{
  width: 49%;
  background: #F7F7F7;
  box-sizing: border-box;
  padding: 5px 10px;
  border-radius: 10px;
}

#products>div+div+div{
  margin-top: 5px;
}
#products>div>a{
  text-decoration: none;
}
#products>div>a>img{
  width: 50%;
}
.title{
  margin: 10px;
  color:#333;
  font-size: 0.35rem;
  height: 35px;
}
.price{
  color: red;
  font-size:14px;
  height: 25px;
  line-height: 25px;
  margin-top: 5px;
}
.search{
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  background: rgba(204, 201, 201, 0.466);
  justify-content: center;
  align-items: center;
  display: flex;
  margin-top: 40px;
}
.search>input,.search>button{
  border: 0;
  outline: 0;
  color: #333;
}
.search>input{
  width: 200px;
  height: 25px;
  padding: 2px;
}
.search>button{
  padding: 7px;
}
.disabled{
  color: #fff !important;
  background: #333;
}
</style>

