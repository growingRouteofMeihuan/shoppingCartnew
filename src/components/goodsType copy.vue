<template>
  <div>
    <!-- 商品分类录入页 -->
    <h2>{{ msg }}</h2>
    <!-- 录入提交按钮 -->
    <van-button v-if="isLogin" type="primary" @click="addGoodsToDb"
      >录入商品</van-button
    >
    <!-- 商品录入框 -->
    <div class="wrapDiv cle" v-if="isAddGoods">
      <!-- 用button来控制循环的次数 -->
      <div v-for="item in emptyGoodsDomArr" class="goodsCategory cle">
        <addGoods @pushGoodsinfo="pushGoodsinfoFn" @isVoidFalse="isVoidFalseFn">
        </addGoods>
      </div>
      <van-button type="primary" @click="addInputBoxBtn">+</van-button>
      <van-button type="primary" @click="cancelBtn">取消</van-button>
      <van-button type="primary" @click="submitBtn">提交</van-button>
    </div>
    <!-- 半透明背景色 -->
    <!-- <div class="entryGoodsDivBg" v-if="isAddGoodsBgc"></div> -->
    <!-- 侧边栏 -->
    <div class="sideBarFn">
      <van-sidebar v-model="activeKey" @change="sliderChange">
        <van-sidebar-item
          v-for="(item, inx) in GoodsCategoryData"
          :key="inx"
          :title="item.name"
        />
      </van-sidebar>
    </div>
    <!-- 侧边栏对应信息 -->
    <div class="columnData">
      <ul>
        <ul>
          <li v-for="item in GoodsCategoryData[activeKey].goodList_phoneList">
            {{ item.category }}
            {{ item.name }}
            {{ item.category }}
            {{ item.price }}
            <img :src="item.img" style="width: 40%" />
          </li>
        </ul>
      </ul>
    </div>
    <!-- 商品列表展示 -->

    <div class="Goodslist">
      <h3>————已录入商品列表————</h3>
      <van-tabs v-model="tabActive" animated>
        <van-tab
          v-for="(item, inx) in GoodsCategoryData"
          :key="inx"
          :title="item.name"
        >
          <div v-for="item in GoodsCategoryData">
            <ul>
              <li>{{ item.name }}</li>
              <li>{{ item.price }}</li>
              <li>{{ item.describe }}</li>
            </ul>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <footerBar></footerBar>
  </div>
</template>

<script>
import axios from "axios";
//导入路由配置
import API_LIST from "@/APIlist.config";
import footerBar from "./footerBar";
import addGoods from "./addGoods";

export default {
  name: "goodsType",
  components: { footerBar, addGoods },
  data() {
    return {
      msg: "商品分类页",
      tabbarActive: 0,
      tabActive: 0,
      // 是否已登录
      isLogin: false,
      // 背景半透明色是否出现(未写)
      isAddGoodsBgc: false,
      // 添加商品框是否出现
      isAddGoods: false,
      //商品信息是否填写完整
      isComplete: false,
      //总商品信息数组
      isNameRepeat: true,
      //待提交商品
      allGoodsInfo: [],
      //空白录入框
      emptyGoodsDomArr: [{}],
      //获得商品大类
      GoodsCategoryData: "",
      //侧边栏
      activeKey: 0,
    };
  },
  created() {
    let userInfo = JSON.parse(localStorage.userInfo);
    //判断是否有权限操作添加商品类别，此处简略地认为只有
    // 当处于登陆状态且用户名为lmh才能操作
    if (userInfo && userInfo.username === "lmh") {
      this.isLogin = true;
    }
    this.getGoodsCategoryFn();
  },
  methods: {
    //侧边栏
    sliderChange(_key) {
      console.log(_key);
      this.activeKey = _key;
    },
    // 获取已录入商品列表
    getGoodsCategoryFn() {
      axios.get(API_LIST.getGoodsCategory).then((_d) => {
        console.table(_d.data);
        this.GoodsCategoryData = _d.data;
        console.log(this.GoodsCategoryData[0].goodList_appList);
        console.log(this.GoodsCategoryData[0].goodList_carList);
        console.log(this.GoodsCategoryData[0].goodList_phoneList);
        console.log(this.GoodsCategoryData[0].goodList_clothesList);
      });
    },
    // 取消提交商品
    cancelBtn() {
      this.isAddGoods = false;
    },
    addGoodsToDb() {
      this.isAddGoods = true;
    },
    //添加商品信息到总的商品信息列表,子传父itemGoodsInfo形参，接收子组件传回的实参
    pushGoodsinfoFn(itemGoodsInfo) {
      // 判断商品名称是否重合
      let _is = true;
      for (let i = 0; i < this.allGoodsInfo.length; i++) {
        if (this.allGoodsInfo[i].name === itemGoodsInfo.name) {
          _is = false;
          break;
        }
      }
      //如果没有重名
      if (_is) {
        this.allGoodsInfo.push(itemGoodsInfo);
        this.isNameRepeat = true;
      } else {
        this.isNameRepeat = false;
        // 如果有重名
        this.$dialog.alert({
          // 返回注册提示
          message: "商品重名了",
        });
      }
      //商品信息填写完整
      this.isComplete = true;
    },
    //信息未写完时触发
    isVoidFalseFn() {
      this.isComplete = false;
    },
    // 四个框填完，且没有重名才能增加空白框
    addInputBoxBtn() {
      if (this.isComplete && this.isNameRepeat) {
        this.emptyGoodsDomArr.push({});
      } else {
        this.$dialog.alert({
          // 返回注册提示
          message: "请填写完整的商品信息,或检查商品是否重名",
        });
      }
    },
    //批量录入商品
    submitBtn() {
      console.log(this.allGoodsInfo);
      axios.post(API_LIST.insertGoods, this.allGoodsInfo).then((_d) => {
        this.$dialog
          .alert({
            // 返回注册提示
            message: "商品录入成功",
          })
          .then(() => {
            //商品录入成功，关闭录入商品框
            this.isAddGoods = false;
            // 重置已录入商品信息框
            this.allGoodsInfo = [];
            //重置空白录入框
            this.emptyGoodsDomArr = [{}];
            //获取商品大类
            this.getGoodsCategoryFn();
          });
      });
    },
  },
};
</script>

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
  font-size: 14px;
  text-align: center;
  padding: 0;
  margin: 5px 0;
  color: #666;
}
.goodsCategory {
  clear: both;
  margin: 10px 0;
  height: 50px;
}
.goodsCategory:hover {
  background: #ddd;
}
.goodsCategory li {
  float: left;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
}
.goodsCategory li img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 1px solid #666;
}
.goodsEntry {
  width: 80%;
  position: absolute;
  top: 10%;
  left: 50%;
  margin-left: -42%;
  z-index: 112;
  padding: 10px;
  background: #ddd;
  border-radius: 10px;
  border: 1px solid #999;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
}
.entryGoodsDivBg {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
  z-index: 111;
  position: absolute;
  top: 0;
  left: 0;
}
.imgSize {
  width: 100%;
  height: 100%;
}
.sideBarFn {
  width: 80px;
  position: absolute;
  top: 330px;
  left: 0;
  z-index: 10;
}
.columnData {
  clear: both;
  width: 70%;
  height: 400px;
  background: #666;
  margin: 0 0 0 90px;
}
</style>