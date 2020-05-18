<template>
  <div class="detail">
    <mt-header title="TP_LINK商城">
        <router-link to="/" slot="left"> 
                 <mt-button icon="back">
                 </mt-button>
          </router-link>
          <router-link to="/car" slot="right"> 
              <mt-button>
                  <img src="../assets/img/tabbar/car_active.png" alt="" id="car">
              </mt-button>
          </router-link>
    </mt-header>
    <div id="product">
      <mt-swipe class="banner" :showIndicators='false'>
          <mt-swipe-item v-for="(item,index) of product_banner" :key="index">
                <img :src="item" alt="">
          </mt-swipe-item>
      </mt-swipe>
      <div class='title' v-text="product.title"></div>
      <div class='details' v-text="product.details"></div>
      <div class='price' v-text="`￥${product.price}`"></div>
      <div><span class="address" v-text="product.address"></span><span class='isSAvailble' v-text="product.isAvailable"></span></div>
      <div id="buy">
        <div><button @click='getnum(-1)'>-</button><input type="text" readonly v-model="num"> <button @click="getnum(1)">+</button></div>
        <button class="to_buy" @click="add_car">加入购物车</button>
      </div>
    </div>
    <div id="comment_title">添加相关评论</div>
    <div class="input">
       <textarea  cols="30" rows="10" v-model="comment"></textarea>
       <div class="p_parent">
         <!-- 图片预览 -->
          <img src="" alt="" id="preview">
       </div> 
       <div class="add">
         <div class="img">
           <span>选择图片</span>
            <input type="file" id="file" @change="change" name="face">
         </div>
         <button id="button" @click="comment_add">评论</button>
       </div>
    </div>
        <mt-navbar v-model="selected">
            <mt-tab-item id="img_detail">图片详情</mt-tab-item>
             <mt-tab-item id="user_comment">相关评论</mt-tab-item>
        </mt-navbar>
         <mt-tab-container v-model="selected" swipeable id="image">
            <mt-tab-container-item id="img_detail">
              <div>
                  <img v-for="(item,index) of product_detail"  :key="index" alt="" :src="item" class='detail_img'>
              </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="user_comment">
              <div class="no_comment" v-if="get_comments.length==0">暂时没有相关评论</div>
              <div v-else class="has_comment">
                <div v-for="(item,index) of get_comments" :key="index" class="comment_item">
                  <div v-text="`用户：${item.uname}`"></div>
                  <div>
                      <!-- <img :src="item.url" alt=""> -->
                  </div>
                    <div v-text="`评论：${item.comment}`"></div>
                    <div>
                      <ul class="say">
                        <li @click="change_nice(index)">
                          <img v-if="nice_img_arr[index].nice" src="../assets/img/product_detail_img/nice.png" alt="" class="nw_img">
                          <img v-else src="../assets/img/product_detail_img/nice_active.png" class="nw_img" alt="">
                          <!-- <span v-text="item.nice"></span> -->
                        </li>
                        <li  @click="change_wrong(index)">
                          <img v-if="wrong_img_arr[index].wrong" src="../assets/img/product_detail_img/wrong.png" class="nw_img" alt="">
                          <img v-else src="../assets/img/product_detail_img/wrong_active.png" class="nw_img" alt="">
                          <!-- <span v-text="item.wrong"></span> -->
                        </li>
                        <li><button>回复</button></li>
                      </ul>
                    </div>
                </div>
              </div>
            </mt-tab-container-item>
        </mt-tab-container>
  
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import { constants } from 'zlib';
export default {
  computed:{
       ...mapState(['uid','uname'])
  },
  data(){
    return{
      selected:'img_detail',
      pid:'',
      active:'detail',
      product_banner:[],
      product:[],
      product_detail:[],
      num:1,
      timer:'',
      // 评论相关
      comment:'',
      url:'',
      get_comments:[],
      nice_img_arr:[],
      wrong_img_arr:[]
    } 
  },
  created(){
    // console.log(this.$router)
    // console.log(this.$route)
  this.pid=this.$route.params.pid
  },

  watch:{
    selected(){
      this.get_comment()
    }
  },
  methods:{
    change_nice(index){
     this.nice_img_arr[index].nice=false;
    },
    change_wrong(index){
         this.wrong_img_arr[index].wrong=false;
    },
    get_comment(){
        this.axios.get('/product_details/get_comment').then(res=>{
          this.get_comments=res.data.msg;
          this.get_comments.forEach(ele => {
              this.nice_img_arr.push({'nice':true});
              this.wrong_img_arr.push({'wrong':true})
          });
        })
    },
    change(){
          var preview = document.querySelector('#preview');
           var eleFile = document.querySelector('#file');
            var file=eleFile.files[0];
            if(file.type.indexOf("image") == 0) {
                    this.url=file
                    var reader = new FileReader();
                    reader.readAsDataURL(file);                    
                    reader.onload = function(e) {
                        preview.setAttribute("src",this.result);
                    };
                }else{
                  this.$toast({
                    message:"请选择图片"
                  })
                }
    }
    ,
    comment_add(){
      if(!this.uid){
           this.$toast({
               message:'您还未登录，即将前往登录页面',
               position:'middle',
               duration:1000
            });
            this.timer=setTimeout(() => {
              this.$router.push({path:'/login',query:{redirect:`/detail/${ this.pid}`}})
              this.timer=null
            }, 1000);
      }else{
        if(this.url==''||this.comment==''){
            this.$toast({
              message:"请先添加评论,和图片"
            })
        }else{
        var formData = new FormData()
        var formData = new window.FormData() 
        formData.append('face',this.url);
        formData.append('comment',this.comment);
        formData.append('pid', this.pid);
        formData.append('uname',this.uname);
        formData.append('uid',this.uid);
        formData.append('nice',0);
        formData.append('wrong',0);
          this.axios.post('/product_details/comment',formData).then(res=>{
                if(res.data.code==1){
                  this.$toast({
                    message:res.data.msg
                  })
                  this.comment='';
                   var preview = document.querySelector('#preview');
                     preview.setAttribute("src","");
                }else{
                    this.$toast({
                    message:res.data.msg
                  })
                }
          })
        }
      };//else

    },
      getnum(num){
         this.num+=num;
          this.num<1&&(this.num=1)
      },
      add_car(){
        if(!this.uid){
          this.$toast({
               message:'您还未登录，即将前往登录页面',
               position:'middle',
               duration:1000
            });
            this.timer=setTimeout(() => {
              this.$router.push({path:'/login',query:{redirect:`/detail/${ this.pid}`}})
              this.timer=null
            }, 1000);
        }else{
          // console.log(this.uid,this.num,this.pid)
          this.axios.post('/car/pAdd','uid='+this.uid+'&num='+this.num+'&pid='+this.pid).then(res=>{
            if(res.data.code==1){
              this.$toast({
               message:res.data.msg,
               position:'middle',
               duration:1000
            });
            }else{
              this.$toast({
               message:res.data.msg,
               position:'middle',
               duration:1000
            });
            }
          })
        }
      }
  },
  mounted(){
    this.axios.get('/product_details/',{params:{pid:this.pid}}).then(res=>{
      // console.log(res.data)
        this.product=res.data.product;
        for(var p_b of res.data.picture){
          p_b=require('../assets/'+p_b.lg);
          this.product_banner.push(p_b)
        }
         for(var d of res.data.detial_picture){
          d=require('../assets/'+d.src);
          this.product_detail.push(d)
        }
    });
    this.get_comment();
  }
}
</script>

<style scoped>
.mint-header{
    background: #333;
    height:45px;
    font-size:0.4rem;
}
.banner{
  width: 100%;
  height: 240px;
  box-sizing: border-box;
}
.banner img{
  width: 100%;
  height: 240px;
  box-sizing: border-box;
  padding: 10px;
}
.detail_img{
  width: 100%;
  height: 300px;

}
.title{
  margin-top: 10px;
  font-size: 0.5rem;
  font-weight: bold
}
.details{
  color: grey;
  font-size: 0.4rem;
  margin: 10px 0px;

}
.price{
  color: red;
  font-size: 14px;;
  font-weight: bold;
  margin: 10px 0;
}
.isSAvailble{
  margin-left: 10px;
  color:#0aaeed
}
.to_buy{
  color: #fff;
  border: 0;
  outline: 0;
  padding: 10px 20px;
  border-radius: 5px;
  background: red;
  font-size: 14px;
}
.to_buy:active{
    background: rgb(252, 120, 120);
}
#buy{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  padding: 15px;
  justify-content: center;
}
#buy>:first-child{
  width: 50%;
  height:100%;

}
#buy>:first-child>input{
  width: 20%;
  box-sizing: border-box;
  padding: 10px;
    font-size: 10px
}
#buy>:first-child>button{
  width: 10%;
  box-sizing: border-box;
   padding: 10px 20px;
     font-size: 10px
}
#buy>:first-child>input,#buy>:first-child>button{
  text-align: center;
  border: 1px solid rgb(216, 212, 212);
  background: #fff;
  float: left;
    font-size: 10px
}
#car{
  width: 25px;
  height: 25px;
}
.address,.isSAvailble{
  font-size: 14px;

}
textarea{
  width: 90%;
  margin: 0 auto;
  height: 100px;
  font-size: 14px;
  color: #333;
  border: 0;
  outline: 0;
  border-radius: 10px;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
}
#comment_title{
  text-align: left !important;
  font-size: 18px;
  background: #333;
  padding: 15px 6px;

  color: #fff
}
.input{
  padding: 10px 0px 10px 0px !important;
  overflow: hidden;
  background:#c6c7c92a;
}
.add{
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 5px;
}
.add>button{
    height: 34px;
  line-height: 34px;
  padding: 1px;
  background: #333;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  outline: 0;
  border: 0;
  border-radius: 5px;
  width: 75px
}
.add>button:active{
  color:#333;
  background: #fff
}
.img{
  background: grey;
  position: relative;
  overflow: hidden;
  color: #fff;
  border-radius: 5px;
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  width: 75px
}
.img::after{
  content: '';
  display: block;
  clear: both;
}
.img>input{
  position: absolute;
  top:0;
  right: 0;
  opacity: 0;
  width: 100%;
  height: 34px;
}
#preview{
  max-width: 80px;
  max-height: 80px;
  border-radius: 5px;
  box-sizing: border-box;
  background: #fff;
  margin-left: 15px
}
.p_parent{
text-align: left !important;
width: 100%;
background: transparent
}
#image{
  background: grey;
  padding-top:10px
}

.mint-navbar .mint-tab-item.is-selected{
  border-bottom: 0;
}
.no_comment{
  color: grey;
  font-size: 18px;
  min-height: 100px;
}
.has_comment{
    min-height: 100px;
}
.comment_item{
  background: #fff;
  border-radius: 5px;
  width: 95%;
  margin: 0 auto;
  margin-bottom: 10px;
  text-align: left;
}
.comment_item>:first-child{
  color: red;
  font-size: 14px;
  font-weight: bold;
  padding: 5px 0px 0px 5px;
  border-bottom: 1px solid #333;
}
.comment_item>:nth-child(3){
  font-size: 12px;
  padding: 5px 0px 0px 5px;
}
.say{
  list-style: none;
  padding: 5px;
  font-size: 12px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-around;
}

.say>li>button{
  border: 0;
  outline: 0;
  background: #333;
  color: #fff;
  font-size: 12px;
  border-radius: 3px;
}
.say>li>button>:active{
  background: #fff;
  color: #333;
}
.nw_img{
  vertical-align: middle;
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.say span{
  width: 20px;
  height: 20px;
  background: #333;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
  line-height: 20px;
  color: #fff;
}
</style>