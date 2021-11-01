<template>
  <div>
    <!-- 横向导航栏：商品列表展示 -->
    <div class="wrapDiv cle">
      <van-tabs v-model="tabActive" animated @click="headColumnFn">
        <van-tab
          v-for="(item, inx) in GoodsCategoryData"
          :key="inx"
          :title="item.name"
        >
        </van-tab>
      </van-tabs>
    </div>

    <!-- 录入提交按钮 -->
    <van-button v-if="isLogin" type="primary" @click="addGoodsToDb"
      >录入商品</van-button
    >
    <!-- 商品录入框 -->
    <div v-if="isAddGoods" class="goodsEntry cle">
      <!-- 用button来控制循环的次数 -->
      <div v-for="item in emptyGoodsDomArr">
        <addGoods @pushGoodsinfo="pushGoodsinfoFn" @isVoidFalse="isVoidFalseFn">
        </addGoods>
      </div>
      <van-button type="primary" @click="addInputBoxBtn" style="height: 25px"
        >+</van-button
      >
      <van-button type="primary" @click="cancelBtn" style="height: 25px"
        >取消</van-button
      >
      <van-button type="primary" @click="submitBtn" style="height: 25px"
        >提交</van-button
      >
    </div>
    <!-- 半透明背景色 -->
    <div class="entryGoodsDivBg" v-if="isEntryGoodsDivBg"></div>
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
      <ul v-for="item in goodsListData" @click="goToGoodsProduct(item)">
        <li>
          <img :src="item.img" />
        </li>
        <li>
          {{ item.name }}
        </li>
        <li>￥{{ item.price }}</li>
        <li>{{ item.describe }}</li>
      </ul>
    </div>
    <!-- 分页 -->
    <van-pagination
      v-model="currentPage"
      :total-items="totalItems"
      items-per-page="3"
      mode="simple"
      @change="pageChangeFn"
      class="page"
    />
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
      //输入框背景
      isEntryGoodsDivBg: false,
      msg: "商品分类页",
      tabbarActive: 0,
      //分页
      currentPage: 1,
      totalItems: 0,
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
      //侧纵向边栏
      activeKey: 0,
      //横向导航栏
      tabActive: 0,
      //侧边栏信息
      goodsListData: [],
    };
  },
  created() {
    let userInfo = JSON.parse(localStorage.userInfo);
    //判断是否有权限操作添加商品类别，此处简略地认为只有
    // 当处于登陆状态且用户名为lmh才能操作
    if (userInfo && userInfo.username === "lmh") {
      this.isLogin = true;
    }
    //分类数据
    this.getGoodsCategoryFn();
    //侧边栏数据,计算数据总条数
    this.getGoodsListDataFn("goodsList_phone");
    //分页数据
    this.pageChangeFn();
  },
  watch: {
    // 横向导航栏索引关联纵向导航栏索引
    tabActive(_inx) {
      let cName = this.GoodsCategoryData[_inx].describe;
      this.getGoodsListDataFn(cName);
    },
  },
  methods: {
    //转跳商品详情页
    goToGoodsProduct(_item) {
      this.$router.push({
        // 跳到这个路由组件
        name: "goodsProduct",
        // 带参数请求：带着点击的对象
        query: { _goodsObjId: _item._id, _Collection: _item.category },
      });
    },
    // 页码变化时触发
    pageChangeFn() {
      let colName = "";
      if (!this.GoodsCategoryData) {
        colName = "goodsList_phone";
      } else {
        colName = this.GoodsCategoryData[this.tabActive].describe;
      }
      axios
        .get(API_LIST.getPageChange, {
          params: {
            startNum: (this.currentPage - 1) * 3,
            _c: colName,
          },
        })
        .then((_d) => {
          //console.log(_d.data);
          this.goodsListData = _d.data;
        });
    },
    //横向分类栏
    headColumnFn(_inx) {
      // 横向导航栏索引关联纵向导航栏索引
      this.activeKey = _inx;
    },
    //侧边栏
    sliderChange(_key) {
      //分页归0
      this.currentPage = 1;
      //console.log(_key);
      this.activeKey = _key;
      // 横向导航栏索引关联纵向导航栏索引
      this.tabActive = _key;
      let cName = this.GoodsCategoryData[_key].describe;
      // 侧边栏类别改变时，先计算总的数据条数
      this.getGoodsListDataFn(cName);
      // 然后获取分页数据
      this.pageChangeFn();
    },
    // 查询商品所属栏目信息（总长度）
    getGoodsListDataFn(category) {
      axios
        .get(API_LIST.getGoodsListData, {
          params: {
            categoryName: category,
          },
        })
        .then((_d) => {
          //console.log(_d.data);
          //分类下的所有商品的总数
          this.totalItems = _d.data.length;
        });
    },
    // 获取已录入商品列表
    getGoodsCategoryFn() {
      axios.get(API_LIST.getGoodsCategory).then((_d) => {
        //console.table(_d.data);
        this.GoodsCategoryData = _d.data;
      });
    },
    // 取消提交商品
    cancelBtn() {
      this.isAddGoods = false;
      this.isEntryGoodsDivBg = false;
    },
    addGoodsToDb() {
      this.isAddGoods = true;
      this.isEntryGoodsDivBg = true;
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
            this.isEntryGoodsDivBg = false;
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
  position: relative;
  width: 60%;
  height: 50px;
  overflow: hidden;
  border: 1px solid #666;
  background: #eee;
  border-radius: 10px;
  margin: 10px auto;
}
.pos {
  z-index: 113;
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
  top: 100px;
  left: 0;
  z-index: 10;
}
.columnData {
  clear: both;
  width: 70%;
  background: #666;
  margin: 0 0 0 90px;
}
.columnData ul {
  display: block;
  clear: both;
  overflow: hidden;
  margin: 10px 0;
  background: #ddd;
}
.columnData ul li {
  float: left;
  margin: 5px;
}
.columnData ul li.tip {
  background: #eee;
  padding: 2px;
}
.columnData ul li img {
  width: 50px;
  height: 50px;
}
.page {
  width: 50%;
  margin: 5px auto;
}
</style>