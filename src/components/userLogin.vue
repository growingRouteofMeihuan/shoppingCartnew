<template>
  <div>
    <!-- 登录页面 -->
    <van-nav-bar
      :title="msg"
      left-text="返回"
      left-arrow
      @click-left="gobackFn"
    />
    <van-field
      v-model="username"
      required
      clearable
      label="用户名"
      placeholder="请输入用户名"
      :error-message="namr_err"
    />
    <van-field
      type="password"
      v-model="password"
      required
      clearable
      label="密码"
      placeholder="请输入密码"
      :error-message="password_err"
    />
    <van-button type="primary" @click="userLoginFn">登录</van-button>
    <van-button type="primary" @click="registerBtn">注册</van-button>
  </div>
</template>

<script>
import axios from "axios";
import API_LIST from "@/APIlist.config";

export default {
  name: "userLogin",
  data() {
    return {
      msg: "登录页面",
      // 用户信息收集
      username: "",
      password: "",
      // 错误提示
      namr_err: "",
      password_err: "",
    };
  },
  methods: {
    //返回上一步
    gobackFn() {
      this.$router.go(-1);
      //   Toast("返回");
    },
    //登录
    userLoginFn() {
      let _loginObj = {
        username: this.username,
        password: this.password,
      };
      axios.post(API_LIST.userLogin_post, _loginObj).then((_d) => {
        if (_d.data.login_code === 1) {
          this.namr_err = _d.data.login_info;
        } else if (_d.data.login_code === 2) {
          this.password_err = _d.data.login_info;
        } else if (_d.data.login_code === 3) {
          //登录成功，本地保存用户信息
          //console.log(_d.data);
          //因为传过来时一个js对象，所以本地存储之前把它转成字符串
          localStorage.userInfo = JSON.stringify(_d.data.userinfo);
          this.$router.push({ path: "/" });
        }
      });
    },
    //注册转跳
    registerBtn() {
      //点击转跳注册页面
      this.$router.push({ path: "/register" });
    },
  },
};
</script>