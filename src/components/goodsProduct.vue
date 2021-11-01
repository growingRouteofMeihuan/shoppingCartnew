<template>
  <div>
    <!-- 商品详情页 -->
    <!-- 页面导航栏 -->
    <van-nav-bar
      :title="msg"
      left-text="返回"
      left-arrow
      @click-left="gobackFn"
    />
    <!-- 商品详情展示 -->
    <div class="goodsImgWrap">
      <img :src="goodsImgUrl" />
      <h2>{{ goodsTitle }},{{ goodsDescribe }}</h2>
      <p>价格：${{ goodsPrice }}</p>
    </div>
    <!-- 加入购物车详情 -->
    <van-sku
      v-model="show"
      :sku="sku"
      :goods="goods"
      :goods-id="goodsId"
      :quota="0"
      :quota-used="0"
      :hide-stock="sku.hide_stock"
      :reset-stepper-on-hide="true"
      :disable-stepper-input="true"
      @sku-selected="switchProductType"
      @add-cart="onAddCartClicked"
    />
    <!-- 购物导航栏 -->
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" @click="helpBtn" />
      <van-goods-action-icon
        icon="cart-o"
        text="购物车"
        @click="goodsCartFn"
        :badge="cartNum"
      />
      <van-goods-action-button
        type="warning"
        text="加入购物车"
        @click="onClickBigBtn"
      />
      <van-goods-action-button type="danger" text="立即购买" />
    </van-goods-action>
  </div>
</template>

<script>
import axios from "axios";
import API_LIST from "@/APIlist.config";
export default {
  name: "goodsProduct",
  created() {
    // 通过路由获得了传过来的值
    // console.log(this.$route.query._goodsObjId);
    let goodsId = this.$route.query._goodsObjId;
    let goodsColl = this.$route.query._Collection;
    this.goodsId = goodsId;
    this.getGoodInfoFn(goodsId, goodsColl);
    //页面刚加载时加载之前购物车有的信息
    var xx = localStorage.cartData ? JSON.parse(localStorage.cartData) : [];
    //localStorage.removeItem("cartData");
    console.log(xx);
    this.cartNumFn();
  },
  data() {
    return {
      msg: "产品详情页",
      goodsDescribe: "",
      goodsTitle: "",
      goodsImgUrl: "",
      goodsDescribe: "",
      goodsPrice: "",
      // 购物车已有商品数量提示
      cartNum: 0,
      // sku配置
      show: false,
      goodsId: "",
      sku: {
        tree: [
          {
            k: "颜色", // skuKeyName：规格类目名称
            k_s: "s1", // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
            v: [
              {
                id: "1", // skuValueId：规格值 id
                name: "红色", // skuValueName：规格值名称
                imgUrl: "https://img01.yzcdn.cn/1.jpg",
              },
              {
                id: "1",
                name: "蓝色",
                imgUrl: "https://img01.yzcdn.cn/2.jpg",
              },
            ],
            largeImageMode: true, //  是否展示大图模式
          },
        ],
        list: [
          {
            id: 2259, // skuId
            s1: "1", // 规格类目 k_s 为 s1 的对应规格值 id
            s2: "1", // 规格类目 k_s 为 s2 的对应规格值 id
            price: 100, // 价格（单位分）
            stock_num: 110, // 当前 sku 组合对应的库存
          },
        ],
        price: " ", // 默认价格（单位元）
        stock_num: 227, // 商品总库存
        collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        none_sku: false, // 是否无规格商品
        hide_stock: false, // 是否隐藏剩余库存
      },

      goods: {
        // 默认商品 sku 缩略图
        picture: "https://img01.yzcdn.cn/1.jpg",
        title: "",
      },
      //messageConfig: {
      // 数据结构见下方文档
      //},
    };
  },
  methods: {
    helpBtn() {
      this.$dialog.alert({
        // 返回注册提示
        message: "当前客服忙",
      });
    },
    // 购物车已有商品数量提示
    cartNumFn() {
      let _temp = localStorage.cartData
        ? JSON.parse(localStorage.cartData)
        : [];
      this.cartNum = 0;
      for (let i = 0; i < _temp.length; i++) {
        this.cartNum += _temp[i]._num;
      }
    },
    //购物车
    goodsCartFn() {
      this.$router.push({ path: "/cart" });
    },
    //   添加到购物车
    onAddCartClicked(skuData) {
      //真正的生产环境中，这些数据要发送到后端
      //console.log(skuData);
      let _isTrue = false;
      //添加购物车传过来的信息进行包装
      let _temObj = {
        _id: skuData.goodsId,
        _price: this.goodsPrice,
        _num: skuData.selectedNum,
        _goodsName: this.goodsTitle,
        _img: this.goodsImgUrl,
      };
      //已经保存的数据
      let _cartData = localStorage.cartData
        ? JSON.parse(localStorage.cartData)
        : [];
      for (let i = 0; i < _cartData.length; i++) {
        //当新提交的里面与本地存储存的商品有重名的
        if (_cartData[i]._id === _temObj._id) {
          _isTrue = true;
          //   更新本地储存
          _cartData[i]._num = _temObj._num;
          break;
        }
      }
      //当新提交的里面与本地存储存的商品没有重名的
      if (!_isTrue) {
        _cartData.push(_temObj);
      }
      //   本地存储
      localStorage.cartData = JSON.stringify(_cartData);
      this.$dialog
        .alert({
          // 返回注册提示
          message: "加入购物车成功",
        })
        .then(() => {
          this.show = false;
          this.cartNumFn();
        });
    },
    //切换产品类型
    switchProductType() {
      this.sku.list[0].price = this.sku.price * 100;
    },
    // 顶部导航栏
    gobackFn() {
      this.$router.go(-1);
    },
    //根据id获取对应商品信息
    getGoodInfoFn(_gId, _Collection) {
      axios
        .get(API_LIST.getGoodsInfo, {
          params: {
            _id: _gId,
            _findCollection: _Collection,
          },
        })
        .then((_d) => {
          //console.log(_d.data);
          this.goodsTitle = _d.data.name;
          this.goodsImgUrl = _d.data.img;
          this.goodsDescribe = _d.data.describe;
          this.goodsPrice = _d.data.price;
          //goods的配置
          this.goods.picture = _d.data.img;
          this.goods.title = _d.data.name;
          this.sku.price = _d.data.price;
        });
    },
    //加入购物车
    onClickBigBtn() {
      if (!localStorage.userInfo) {
        this.$dialog.alert({
          // 返回注册提示
          message: "当前未登录，请先前往首页登录",
        });
      } else {
        this.show = true;
      }

      //   考虑安全，不能用路由传数据
    },
  },
};
</script>

<style scoped>
.goodsImgWrap {
  width: 100%;
  height: 350px;
  overflow: hidden;
  margin: 0 auto;
}
.goodsImgWrap img {
  width: 100%;
}
</style>