<template>
  <div>
    <!-- 页面导航栏 -->
    <van-nav-bar
      :title="msg"
      left-text="返回"
      right-text="退出登录"
      left-arrow
      @click-left="gobackFn"
      @click-right="unloginBtn"
    />
    <h4>用户名：{{ username }}</h4>
    <h4>个性签名：{{ describe }}</h4>

    <footerBar> </footerBar>
  </div>
</template>

<script>
import axios from "axios";
import API_LIST from "@/APIlist.config";
import footerBar from "./footerBar";
export default {
  name: "userCenter",
  components: { footerBar },
  data() {
    return {
      msg: "用户中心",
      username: "",
      describe: "",
    };
  },
  created() {
    let userInfo = JSON.parse(localStorage.userInfo);
    this.username = userInfo.username;
    this.describe = userInfo.self_introduction;
  },
  methods: {
    //退出登录
    unloginBtn() {
      this.$notify(this.username + "已退出登陆");
      localStorage.userInfo = "";
      this.isLogin = true;
      this.$router.push({ path: "/" }, () => {
        localStorage.setItem("inxState", 0);
      });
    },
    // 顶部导航栏
    gobackFn() {
      this.$router.push({ path: "/" }, () => {
        localStorage.setItem("inxState", 0);
      });
    },
  },
};
</script>