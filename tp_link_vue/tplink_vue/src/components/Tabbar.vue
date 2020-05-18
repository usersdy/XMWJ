<template>
    <div>
        <mt-tabbar v-model="selected" fixed>
            <mt-tab-item id="home">
                <img src="../assets/img/tabbar/home_active.png" v-if="selected=='home'" slot="icon">
                <img src="../assets/img/tabbar/home.png" alt="" slot="icon" v-else>
                首页
            </mt-tab-item>
             <mt-tab-item id="car">
                 <img src="../assets/img/tabbar/car_active.png" slot="icon" v-if="selected=='car'">
                <img src="../assets/img/tabbar/car.png" alt="" slot="icon" v-else>
                购物车
            </mt-tab-item>
            <mt-tab-item id="user">
                 <img src="../assets/img/tabbar/user_active.png" slot="icon" v-if="selected=='user'">
                <img src="../assets/img/tabbar/user.png" slot="icon" v-else>
                 用户
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>
<script>
export default {
    props:['active'],
    data(){
        return{
            selected:this.active
        }
    },
    watch:{
        selected(value){
            if(value=='home'){
                this.$router.push('/')
            }else if(value=='user'){
                this.$router.push('/user')
            }else{
                 this.$router.push('/car')
            }
        }
    }
}
</script>