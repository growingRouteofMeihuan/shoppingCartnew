// 购物车相关的vuex组件
// 准备actions用于响应组件中的动作
// 准备mutations。用于操作数据（state）
// 准备state，用于存储数据
//接收state的数据并向外输出数据

//导出
export default {
    namespaced: true,
    actions: {
        addToVuex(context, cartArr) {
            context.commit("ADD_TOVUEX", cartArr)
        }
    },
    mutations: {
        ADD_TOVUEX(state, cartArr) {
            state.cartArrVuex = cartArr
            console.log(state.cartArrVuex)
        }
    },
    state: {
        cartArrVuex: ""
    },
    getters: {}
}