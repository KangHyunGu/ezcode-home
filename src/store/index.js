import Vue from 'vue'
import Vuex from 'vuex'
import modules from "./modules"

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
	  appReady : false,
      config : {
        title : "ezCode Home",
				footer : "ezCode all right reserved.",
        menu : [
					{
						title : "Home",
						icon : "mdi-home",
						to : '',
						grant : 0, 
						newTab : false,
						subItems : [
							{
								title : "Menu1",
								icon : "",
								to : '/menu1',
								grant : 0, 
								newTab : false,
								subItems : [
									{
										title : "Menu1-1",
										icon : "",
										to : '/menu1-1',
										grant : 0, 
										newTab : false,
										subItems : []
									},
									{
										title : "Menu1-2",
										icon : "",
										to : '/menu1-2',
										grant : 0, 
										newTab : false,
										subItems : []
									},
								]
							},
							{
								title : "Menu2",
								icon : "",
								to : '/menu2',
								grant : 0, 
								newTab : false,
								subItems : []
							},
						]
					},
					{
						title : "About",
						icon : "mdi-help",
						to : '/about',
						grant : 0, 
						newTab : false,
						subItems : []
					},
				],
      }
    },
    mutations: {
		SET_APP_READY(state) {
			state.appReady = true;
		}
    },
    actions: {
		async appInit({dispatch, commit}, member) {
			// 사이트 설정을 가지고 옴
			if(member) {
				commit('user/SET_MEMBER', member)
			} else {
				await dispatch('user/initUser')
			}
			commit('SET_APP_READY');
		}
    },
    modules
  })
  export function createStore() {
  	return store;
  }

  export default store;



