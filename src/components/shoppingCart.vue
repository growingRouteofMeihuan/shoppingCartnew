<template>
  <div>
    <!-- 首页 -->
    <h3>首页</h3>
    <!-- 搜索框 -->
    <van-search
      v-model="searchValue"
      show-action
      label="商品名称"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    >
    </van-search>

    <!-- 轮播图 -->
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image" style="width: 80%" />
      </van-swipe-item>
    </van-swipe>

    <!-- 商品展示栏 -->
    <div style="height: 440px; overflow-y: scroll">
      <div v-for="itemObj in allGoods" class="wrapDiv cle goodsList">
        <h4 class="goodsTitle">{{ itemObj.name }}</h4>
        <li
          v-for="item in itemObj.goodsList_carList"
          :key="item.name"
          @click="goodsProductFn(item)"
        >
          <label>
            <img :src="item.img" />
            {{ item.name }} / ￥{{ item.price }}
          </label>
        </li>
        <li
          v-for="item in itemObj.goodsList_phoneList"
          :key="item.name"
          @click="goodsProductFn(item)"
        >
          <label>
            <img :src="item.img" />
            {{ item.name }} / ￥{{ item.price }}
          </label>
        </li>
        <li
          v-for="item in itemObj.goodsList_clothesList"
          :key="item.name"
          @click="goodsProductFn(item)"
        >
          <label>
            <img :src="item.img" />
            {{ item.name }} / ￥{{ item.price }}
          </label>
        </li>
        <li
          v-for="item in itemObj.goodsList_appList"
          :key="item.name"
          @click="goodsProductFn(item)"
        >
          <label>
            <img :src="item.img" />
            {{ item.name }} / ￥{{ item.price }}
          </label>
        </li>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <footerBar></footerBar>
  </div>
</template>

<script>
import axios from "axios";
import API_LIST from "@/APIlist.config";
import footerBar from "./footerBar";

export default {
  name: "shoppingCart",
  components: { footerBar },
  data() {
    return {
      // 轮播图图库
      images: [
        "https://img01.yzcdn.cn/vant/apple-1.jpg",
        "https://img01.yzcdn.cn/vant/apple-2.jpg",
      ],
      // 搜索值
      searchValue: "",
      //商品大类
      tabActive: 0,
      unlogin_msg: `如果你已注册，请点击登录按钮,否则点击注册按钮前往登录页面`,
      login_msg: "",
      //判断当前是否已登录，默认未登录
      isLogin: true,
      //获得每个类商品对应的商品的信息
      allGoods: "",
    };
  },
  created() {
    if (localStorage.userInfo) {
      this.isLogin = false;
      //读的时候转为json对象读取
      let _info = JSON.parse(localStorage.userInfo);
      this.$notify(_info.username + "已经登陆，欢迎回来");
      this.login_msg = "用户名:" + _info.username;
    }
    this.getGoodsCategoryFn();
  },

  methods: {
    onSearch() {
      //console.log(this.searchValue);
      let _value = this.searchValue;
      if ((_value === "") | (_value === undefined)) {
        this.$notify("查询条件不能为空");
      } else {
        axios
          .get(API_LIST.search, { params: { _searchValue: _value } })
          .then((_d) => {
            if (!_d.data) {
              this.$notify("查无此物");
            } else {
              console.log(_d.data);
              //商品详情页
              this.goodsProductFn(_d.data);
            }
          });
      }
    },
    getGoodsCategoryFn() {
      axios.get(API_LIST.getGoodsCategory).then((_d) => {
        //console.table(_d.data);
        this.allGoods = _d.data;
        //console.log(_d.data);
      });
    },

    //商品详情页：参数是商品详情
    goodsProductFn(_self) {
      this.$router.push({
        // 跳到这个路由组件
        name: "goodsProduct",
        // 带参数请求：带着点击的对象
        query: { _goodsObjId: _self._id, _Collection: _self.category },
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.cle:after {
  content: ".";
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.wrapDiv {
  width: 80%;
  overflow: hidden;
  border: 1px solid #666;
  background: #eee;
  border-radius: 10px;
  margin: 10px auto;
}
.wrapDiv p.tip {
  font-size: 22px;
  text-align: center;
  padding: 0;
  margin: 5px 0;
  color: #666;
}
.leftDiv {
  float: left;
  width: 60%;
  margin: 10px;
  border-radius: 10px;
  border: 1px solid #999;
  padding: 10px;
  line-height: 30px;
  text-align: center;
  font-size: 22px;
}
.rightDiv {
  float: right;
  width: 20%;
  margin: 10px;
  border-radius: 10px;
  border: 1px solid #999;
  padding: 10px;
  line-height: 30px;
  text-align: center;
  font-size: 22px;
}
.sliderDiv {
  width: 80%;
  margin: 10px auto;
}
.sliderDiv img {
  width: 100%;
  height: 188px;
}

.goodsCategory {
  clear: both;
  margin: 10px 0;
}
.goodsCategory li {
  float: left;
}
.goodsCategory li img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 1px solid #666;
}

.goodsList {
  background-color: #fff;
}
.goodsList li {
  float: left;
  width: 49%;
  overflow: hidden;
  margin: 0 0 10px 0;
}
.goodsList li label {
  width: 100px;
  height: 115px;
  display: block;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
  text-align: center;
  position: relative;
  border: 1px solid #666;
}
.goodsList li img {
  height: 100%;
  position: absolute;
  top: -5px;
  left: 0;
  clear: both;
  display: block;
  margin: 5px auto;
  padding: 0;
}
.goodsList h1.goodsTitle {
  clear: both;
  margin: 5px auto;
  font-size: 22px;
  border-radius: 5px;
  background: #5d5d5d;
  width: 50%;
  color: #fff;
  padding: 3px 0;
}
</style>

