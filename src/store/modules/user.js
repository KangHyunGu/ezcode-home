import Vue from "vue";
export const state = () => ({
    member : null,
});


export const mutations = {
    SET_MEMBER(state, member){
        state.member = member;
    }
    
};

export const getters = {

};

export const actions = {
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
        if(data) {
            console.log('loginLocal data : ', data)
            commit('SET_MEMBER', data.member)
        }
        return data
    }
};