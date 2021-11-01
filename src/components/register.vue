<template>
  <div>
    <!-- 登记页面 -->
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
    <van-field
      type="password"
      v-model="repeatPassword"
      required
      clearable
      label="确认密码"
      placeholder="请输入再次密码"
      :error-message="password2_err"
    />
    <van-field
      v-model="self_introduction"
      required
      clearable
      label="个人简介"
      placeholder="请输入你的个性签名"
    />
    <van-button type="primary" @click="registerNowFn">立即注册</van-button>
    <van-button type="primary" @click="registerResetFn">重置</van-button>
  </div>
</template>

<script>
import axios from "axios";
import API_LIST from "@/APIlist.config";
export default {
  name: "register",
  data() {
    return {
      msg: "注册页面",
      // 用户信息收集
      username: "",
      password: "",
      repeatPassword: "",
      self_introduction: "",
      // 错误提示
      namr_err: "",
      password_err: "",
      password2_err: "",
    };
  },
  methods: {
    //返回上一步
    gobackFn() {
      this.$router.go(-1);
      //   Toast("返回");
    },
    //注册
    registerNowFn() {
      //提示信息置空
      this.namr_err = "";
      this.password_err = "";
      this.password2_err = "";
      // 收集注册信息
      let _registerInfo = {
        username: this.username,
        password: this.password,
        repeatPassword: this.repeatPassword,
        self_introduction: this.self_introduction,
      };
      //   console.log(_registerInfo);
      if (_registerInfo.username === "") {
        this.namr_err = "用户名不能为空";
        console.log(this.namr_err);
        return false;
      }
      if (_registerInfo.password === "") {
        this.password_err = "密码不能为空";
        return false;
      }
      if (_registerInfo.repeatPassword === "") {
        this.password2_err = "重复密码不能为空";
        return false;
      }
      if (_registerInfo.repeatPassword !== _registerInfo.password) {
        this.password2_err = "重复密码不一致";
        return false;
      }
      //注册信息没有问题，就调用这个就向服务器提交信息

      this.postRegisterInfo(_registerInfo);
    },
    // 向服务器提交注册信息
    postRegisterInfo(_Info) {
      //console.log(API_LIST.register_post);
      //post传参方式
      axios.post(API_LIST.register_post, _Info).then((_d) => {
        // console.log(_d.data);
        this.$dialog
          .alert({
            // 返回注册提示
            message: _d.data.reginfo,
          })
          .then(() => {
            if (_d.data.reg_code === 1) {
              //注册成功，跳回登录页面
              this.$router.push({ path: "/userLogin" });
            }
          });
      });
    },
    // 重置
    registerResetFn() {
      this.username = "";
      this.password = "";
      this.repeatPassword = "";
      this.self_introduction = "";
    },
  },
};
</script>