import Vue from "vue";
export const state = () => ({
    member : null,
});


export const mutations = {

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
        console.log(data);
    }
};