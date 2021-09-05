import Vue from "vue";
import qs from 'qs'

export const state = () => ({
    member : null,
    token : null
});


export const mutations = {
    SET_MEMBER(state, member){
        state.member = member;
    },
    SET_TOKEN(state, token){
        state.token = token;
    }
};

export const getters = {

};

export const actions = {
    async initUser({commit}){
        const {$axios} = Vue.prototype
        const data = await $axios.get('/api/member/auth');
        if(data && data.member && data.token){
            commit('SET_MEMBER', data.member);
            commit('SET_TOKEN', data.token);
        }
    },
    //ctx {commit, dispatch}
    //dispatch actions 끼리 서로 주고 받을때
    //commit mutations로 상태 변화 할때
    async duplicateCheck(ctx, {field, value}) {
        const { $axios } = Vue.prototype;
        const data = await $axios.get(`/api/member/duplicateCheck/${field}/${value}`)
        return data;
    },
    async createMember(ctx, form) {
        console.log('======> : ' ,form);
        const { $axios} = Vue.prototype
        const data = await $axios.post(`/api/member`, form)
        return data;
    },
    async signInLocal({commit}, form){
        console.log('Login ======> : ' ,form);
        const { $axios} = Vue.prototype
        const data = await $axios.post(`/api/member/loginLocal`, form)
        if(data && data.member) {
            console.log('loginLocal data : ', data)
            commit('SET_MEMBER', data.member)
            //데이터 쿠키 Set
            //개발자 모드 Application -> Cookies 확인 가능
            // VueCookies.set('token', data.token)
            commit('SET_TOKEN', data.token)
        }
        return !!data;
    },

    async signOut({commit, state}) {
        const mb_name = state.member.mb_name
        const {$axios} = Vue.prototype
        await $axios.get('/api/member/signOut');
        commit('SET_MEMBER', null);
        commit('SET_TOKEN', null);
        //VueCookies.remove('token');
        return mb_name;
    },

    async findIdLocal(ctx, form){
        const {$axios} = Vue.prototype
        const query = qs.stringify(form)

        //mb_name=test&mb_email=test%40daum.net
        //console.log(query);
        const data = await $axios.get(`/api/member/findId?${query}`);
        return data
    }
};