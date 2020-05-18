<template>
     <div id="register" :style="{height:height}">
         <mt-header  title="TP_LINK商城">
             <router-link to="/" slot="left"> 
                 <mt-button icon="back">
                 </mt-button>
             </router-link>
         </mt-header>
         <div id="input">
            <mt-field type="text"  label="用户名：" placeholder="请输入6位用户名" v-model="username" :state="nState">

            </mt-field >
            <mt-field type="password"  label="密码：" placeholder="请输入8位密码" v-model="upwd" :state="pwdState">

            </mt-field >
             <mt-field type="password" label="密码验证：" placeholder="请再次输入密码" v-model="msg_upwd" :state='MpState'>

            </mt-field >
            <mt-field  label="手机号：" placeholder="请输入手机号" v-model="phone" :state='PState'>

            </mt-field >
            <mt-button size="large" @click="register">免费注册</mt-button>
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
            msg_upwd:'',
            phone:'',
            canRegister:true,
            nState:"",
            pwdState:"",
            MpState:"",
            PState:""
        }
    },
    methods:{
        toast(message){
              this.$toast({
                    message:message,
                    position:'middle',
                    duration:3000
                });
        },
        register(){
            // 用户名
            var Ureg=/^[A-Za-z0-9]{6}$/;
            if(!Ureg.test(this.username.trim())){
                this.nState="error";
                this.toast('用户名格式不正确，请输入6位用户名')
                return
            };
            this.axios.get('/user/uname',{
                 params:{uname:this.username.trim()}
            }).then(res=>{
               if(res.data.code==0){
                   this.nState="error"
                   this.toast('用户名已被注册，请重新输入')
                   return
               }else{
                   this.nState="success"
            // 用户名
            // 密码
            var Preg=/^[A-Za-z0-9]{8}$/;
            if(!Preg.test(this.upwd.trim())){
                this.pwdState="error";
                this.toast('密码错误,请重新输入8位密码，不能含有特殊符号');
                return
            }else{
                this.pwdState="success"
            }
            // 密码
            // 两次密码验证
            if(this.upwd.trim()!=this.msg_upwd.trim()){
                this.toast('两次密码不一样')
                this.MpState="error"
                return
            }else{
                this.MpState="success"
            }
            //两次密码验证
            // 电话号码验证
            var preg=/^1[3-9]{1}\d{9}$/
            if(!preg.test(this.phone.trim())){
                this.PState="error"
                this.toast('手机号格式错误，请输入11位手机号码')
            }else{
                this.PState="success"
            }
            // 电话号码验证
            // 验证完成，存入数据库
           this.axios.post("/user/register",'uname=' + this.username.trim() +　'&upwd=' + this.upwd.trim() +'&phone='+this.phone.trim()).then(result=>{
               if(res.data.code==1){
                   this.$messagebox.confirm('注册成功，是否前往登录页',{
                        confirmButtonText:'是',
                        cancelButtonText:'否',
                        //是否在单击遮罩层时关闭对话框
                        closeOnClickModal:false,
                        //是否允许通过键盘ESC按钮关闭对话框
                        closeOnPressEscape:false,
                        //是否锁定滚动条
                        lockScroll:true
                   }).then(action=>{
                       this.$router.push('/login')
                   }).catch(err=>{
                       this.$router.push('/')
                   })
               }else{
                   this.toast('注册失败')
               }
            })
               };
            });
        }
    },
}
</script>

<style  scoped>
.mint-header{
    background: #333;
    height:45px;
    font-size:0.4rem;
}
#register{
    background: url('../assets/img/login/logo.png') no-repeat;
    background-size: cover;
    width: 100%;
}
#input{
    background: transparent;
    margin:100px auto;
    width: 100%;
    box-sizing: border-box;
    padding:15px;
    max-width: 500px;
}
#input>.mint-button--default{
    background: #333;
    color:#fff;
    margin-top:15px;
}
.mint-msgbox-btn.mint-msgbox-cancel{
    color: red !important;
}
</style>