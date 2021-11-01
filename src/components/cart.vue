<template>
  <div>
    <!-- 购物车结算页 -->
    <!-- 页面导航栏 -->
    <van-nav-bar
      :title="msg"
      left-text="返回"
      right-text="清空购物车"
      left-arrow
      @click-left="gobackFn"
      @click-right="clearCartBtn"
    />
    <h3 v-if="isEmpty">
      现在你的购物车什么东西也没有，赶紧取挑选你喜欢的商品吧
    </h3>
    <!-- 购物车条目 -->
    <div class="goodsDiv" v-for="item in cartArr" :key="item._goodsName">
      <label><img :src="item._img" /></label>
      <h2>
        {{ item._goodsName }},数量：{{ item._num }},单价：{{ item._price }}
        <van-stepper
          v-model="item._num"
          :async-change="true"
          @plus="addBtn"
          @minus="minusBtn"
        />
      </h2>
    </div>
    <!-- 结算，提交定单 -->
    <van-submit-bar
      :price="AllGoodsMoney"
      :button-text="submitTXT"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "cart",
  data() {
    return {
      msg: "购物车",
      isEmpty: false,
      // 购物车商品
      cartArr: "",
      AllGoodsNum: 0,
      submitTXT: "",
      AllGoodsMoney: 0,
    };
  },
  created() {
    this.cartArr = localStorage.cartData
      ? JSON.parse(localStorage.cartData)
      : [];
    if (this.cartArr.length === 0) {
      this.isEmpty = true;
    }

    //console.log(this.cartArr);
    this.countAllGoodsNum();
    this.countAllGoodsMoney();
    //vuex，将购物车里的信息放到vuex里
    this.addToVuex(this.cartArr);
  },
  computed: {
    ...mapState("cart", ["cartArrVuex"]),
  },
  methods: {
    //...mapActions("cart", ["addToVuex"]),
    addToVuex() {
      console.log("addToVuex被调用了");
      this.$store.dispatch("cart/addToVuex", this.cartArr);
    },
    // 去结账
    onSubmit() {
      this.$dialog
        .alert({
          // 返回注册提示
          message: `共${this.AllGoodsNum}个商品，总计${this.AllGoodsMoney}元`,
        })
        .then(() => {
          this.clearCartBtn();
          this.submitTXT = "提交" + "(0)";
        });
    },
    //情空购物车
    clearCartBtn() {
      localStorage.removeItem("cartData");
      this.cartArr = [];
      this.AllGoodsNum = 0;
      this.AllGoodsMoney = 0;
      this.isEmpty = true;
    },
    //计算商品总数
    countAllGoodsNum() {
      this.AllGoodsNum = 0;
      for (let i = 0; i < this.cartArr.length; i++) {
        this.AllGoodsNum += this.cartArr[i]._num;
      }
      this.submitTXT = "提交" + "(" + this.AllGoodsNum + ")";
    },
    //计算商品总价
    countAllGoodsMoney() {
      this.AllGoodsMoney = 0;
      for (let i = 0; i < this.cartArr.length; i++) {
        let goodsItemBill = 0;
        this.AllGoodsNum += this.cartArr[i]._num;
        goodsItemBill = this.cartArr[i]._num * this.cartArr[i]._price * 100;
        this.AllGoodsMoney += goodsItemBill;
      }
    },
    //增加
    addBtn() {
      //console.log(this);
      this.countAllGoodsNum();
      this.countAllGoodsMoney();
    },
    minusBtn() {
      this.countAllGoodsNum();
      this.countAllGoodsMoney();
    },
    gobackFn() {
      this.$router.push({ path: "/" }, () => {
        localStorage.setItem("inxState", 0);
      });
    },
  },
};
</script>

<style scoped>
.pr {
  position: relative;
}
.pa {
  position: absolute;
}
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
h2.title {
  font-size: 20px;
  text-align: center;
}
.cle:after {
  content: ".";
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.goodsDiv {
  width: 95%;
  margin: 5px auto;
  clear: both;
}
.goodsDiv label {
  float: left;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 10px;
}
.goodsDiv label img {
  width: 100px;
  height: 100px;
}
.goodsDiv h2 {
  font-size: 22px;
}
</style>