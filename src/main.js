import store from "./store"
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入vant，移动端组件库，网址https://vant-contrib.gitee.io/vant/#/zh-CN/
//全局引用
import {
  Button, NavBar, Field, Dialog, SubmitBar, Sticky, Swipe, SwipeItem,
  Notify, Tab, Tabs, Tabbar, TabbarItem, Sku, Stepper, Pagination
} from 'vant'

import {
  GoodsAction, GoodsActionIcon, GoodsActionButton, Lazyload,
  Sidebar, SidebarItem, Search
} from 'vant';

Vue.use(GoodsAction).use(GoodsActionButton).use(GoodsActionIcon)
  .use(Button).use(NavBar).use(Field).use(SubmitBar).use(Sticky).use(Search)
  .use(Dialog).use(Notify).use(Tab).use(Stepper).use(Pagination)
  .use(Tabs).use(Tabbar).use(TabbarItem).use(Sku).use(Sidebar).use(SidebarItem)
  .use(Swipe).use(SwipeItem).use(Lazyload);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
