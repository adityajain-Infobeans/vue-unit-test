export default {
    namespaced: true,
    state: {
        userData: {
            is_login: false,
        },
    },
    getters: {
        is_login: (state) => state.userData.is_login,
    },
    mutations: {},
    actions: {},
};