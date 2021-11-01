<template>
  <div>
    <!-- 底部导航栏组件 -->

    <van-tabbar v-model="tabbarActive" @change="switchColumn">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">分类</van-tabbar-item>
      <van-tabbar-item icon="friends-o">购物车</van-tabbar-item>
      <van-tabbar-item icon="setting-o">{{ mytext }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import axios from "axios";
//导入路由配置
import API_LIST from "@/APIlist.config";

export default {
  name: "footerBar",
  data() {
    return {
      tabbarActive: 0,
      mytext: "登录",
    };
  },
  created() {
    if (localStorage.userInfo) {
      this.mytext = "我的";
    }
  },
  mounted() {
    this.tabbarActive = Number(localStorage.getItem("inxState"));
  },
  methods: {
    //判断登录状态
    switchColumn() {
      //当有保存到登录信息时，点什么就是什么，当未登录时
      if (!localStorage.userInfo) {
        this.$dialog
          .alert({
            // 返回注册提示
            message: "当前未登录，请先前往登录",
          })
          .then(() => {
            this.$router.push({ path: "/userLogin" });
          });
      } else {
        let _index = this.tabbarActive;
        console.log(_index);
        switch (_index) {
          case 0:
            //判断登录状态
            //本地保存导航栏状态
            this.$router.push({ path: "/" }, () => {
              localStorage.setItem("inxState", 0);
            });
            break;
          case 1:
            this.$router.push({ path: "/goodsType" }, () => {
              localStorage.setItem("inxState", 1);
            });
            break;
          case 2:
            this.$router.push({ path: "/cart" }, () => {
              localStorage.setItem("inxState", 2);
            });
            break;
          case 3:
            this.$router.push({ path: "/userCenter" }, () => {
              localStorage.setItem("inxState", 3);
            });
            break;
        }
      }
    },
  },
};
</script>