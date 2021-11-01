<template>
  <div>
    <!-- 商品分类页 -->
    <input
      v-model="name"
      class="goodsEntry"
      type="text"
      placeholder="输入名称"
      @blur="nameBlurFn"
    />
    <input
      v-model="price"
      class="goodsEntry"
      type="text"
      placeholder="输入价格"
      @blur="priceBlurFn"
    />
    <input
      v-model="describe"
      class="goodsEntry"
      type="text"
      placeholder="输入描述"
      @blur="describeBlurFn"
    />
    <input
      v-model="image"
      class="goodsEntry"
      type="text"
      placeholder="输入图片"
      @blur="imageBlurFn"
    />
  </div>
</template>

<script>
export default {
  name: "addGoods",
  data() {
    return {
      name: "",
      price: "",
      describe: "",
      image: "",
      itemGoodsInfo: {
        name: "",
        price: "",
        describe: "",
        image: "",
      },
    };
  },
  methods: {
    //失去焦点，赋值
    nameBlurFn() {
      this.itemGoodsInfo.name = this.name;
      this.isInputCheckFn();
    },
    priceBlurFn() {
      this.itemGoodsInfo.price = this.price;
      this.isInputCheckFn();
    },
    describeBlurFn() {
      this.itemGoodsInfo.describe = this.describe;
      this.isInputCheckFn();
    },
    imageBlurFn() {
      this.itemGoodsInfo.image = this.image;
      this.isInputCheckFn();
    },
    // 检查是否每项信息都已录入
    isInputCheckFn() {
      console.log(this.itemGoodsInfo);
      let _is = true;
      //i是key

      for (let i in this.itemGoodsInfo) {
        //if 要调用i，所以要定义？
        if (!this.itemGoodsInfo[i]) {
          _is = false;
          break;
        }
      }
      if (_is) {
        console.log("全写完了");
        //向父组件传值
        this.$emit("pushGoodsinfo", this.itemGoodsInfo);
      } else {
        this.$emit("isVoidFalse");
        console.log("没写完");
      }
    },
  },
};
</script>
<style type="text/css">
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

.goodsEntry {
  float: left;
  width: 30%;
  margin: 10px;
  border-radius: 10px;
  border: 1px solid #999;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
}
</style>