import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uname: sessionStorage.uname? sessionStorage.getItem('uname'):'',
    uid:sessionStorage.uid? sessionStorage.getItem('uid'):''
  },
  mutations: {
     logined(state,payload){
       state.uname=payload.uname;
       state.uid=payload.uid
     },
    logout(state){
      state.uname='',
      state.uid='',
      sessionStorage.clear();
    }
  },
  actions: {
  },
  modules: {
  }
})
