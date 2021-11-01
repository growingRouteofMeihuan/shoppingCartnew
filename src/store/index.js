// 该文件用于创建vuex中最为核心的store
import Vue from "vue";
// 引入
import Vuex from "vuex"
import cart from "./modules/cart"
// 使用，要产生store实例，要先使用vuex
Vue.use(Vuex)

// 创建store，导出
export default new Vuex.Store({
    // 引入配置项,键值同名，简写
    modules: { cart }
})
