import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 创建 store 实例
export default new Vuex.Store({
    state : {
    	user:{},
	    token:null,
	    permissions:[]
    },
    mutations: {
    	//登陆
    	USER_SIGNIN(state,data) {
    		state.permissions = data;
    	},
    	//登出
    	USER_SIGNOUT(state,data){

    	}
    }

})