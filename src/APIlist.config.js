//接口配置文件，实现接口的统一管理

const port = 5678;
const BASEURL = "http://localhost:" + port;
// console.log(BASEURL)

const API_LIST = {
    //查询条件
    node_a: BASEURL + '/node_a',
    //查询结果
    node_b: BASEURL + '/node_b',
    //提交注册信息
    register_post: BASEURL + '/register_post',
    //登录信息
    userLogin_post: BASEURL + '/userLogin_post',
    //批量录入商品
    insertGoods: BASEURL + '/insertGoods',
    //批量获取商品大类信息
    getGoodsCategory: BASEURL + '/getGoodsCategory',
    // 商品详情页信息
    getGoodsInfo: BASEURL + '/getGoodsInfo',
    //购物车
    cart: BASEURL + '/cart',
    //商品侧边栏信息
    getGoodsListData: BASEURL + '/getGoodsListData',
    // 页码变化时触发
    getPageChange: BASEURL + '/getPageChange',
    //查询接口
    search: BASEURL + '/search'

}

export default API_LIST;