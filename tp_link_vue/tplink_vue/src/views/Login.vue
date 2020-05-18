<template>
    <div id="login" :style="{height:height}">
        <mt-header  title="TP_LINK商城">
             <router-link :to="route" slot="left"> 
                 <mt-button icon="back">
                 </mt-button>
             </router-link>
         </mt-header>
        <div id="input">
            <mt-field type="text"  label="用户名：" placeholder="请输入用户名" v-model="username">
            </mt-field >
            <mt-field type="password"  label="密码：" placeholder="请输位密码" v-model="upwd">
            </mt-field >
            <mt-button size="large" @click="login">登录</mt-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
              height:String(document.documentElement.clientHeight || document.body.clientHeight)+'px',
              username:'',
              upwd:'',
              timer:'',
              route:'/'
        }
    },
    created(){
        // console.log(this.$route)
    },
    methods:{
        login(){
            this.axios.post('user/login','uname='+this.username.trim()+'&upwd='+this.upwd.trim()).then(res=>{
                if(res.data.code==1){
                    window.sessionStorage.setItem('uid',res.data.msg[0]);
                    window.sessionStorage.setItem('uname',res.data.msg[1]);
                    this.$store.commit('logined',{uid:res.data.msg[0],uname:res.data.msg[1]})
                    this.$toast({
                        message:'登陆成功',
                        position:'middle',
                        duration:200
                     });
                     
                     this.timer=setTimeout(res=>{
                         if(this.$route.query.redirect){
                         this.$router.push(this.$route.query.redirect);
                         }else{
                             this.$router.push('/')
                         }
                         this.timer=''
                     },200);
                }else{
                    this.$toast({
                        message:'登录失败，用户名或密码错误',
                        position:'middle',
                        duration:2000
                    })
                }
            })
        },
    }
}
</script>
<style scoped>
.mint-header{
    background: #333;
    height: 45px;
    font-size:0.4rem;
}
#login{
    background: url('../assets/img/login/logo.png') no-repeat;
    background-size: cover;
    width: 100%;
}
#input{
    background: transparent;
    margin:100px auto;
    width: 100%;
    box-sizing: border-box;
    padding: 0px 15px;
    max-width: 500px;
}
#input>.mint-button--default{
    background: #333;
    color:#fff;
    margin-top:10px;
}

</style>