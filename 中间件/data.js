//引入mongoDB模块
//获得它的客户端对象：MongoClient，用来连接mongoDB
var MongoClient = require('mongodb').MongoClient;

//获得连接mongoDB的字符串，变量名：DB_CONN_STR,约定俗成的，不要自己乱写
var DB_CONN_STR = 'mongodb://127.0.0.1:27017';


let clothes =
    [{
        name: 'GUCCI', price: 22, category: 'goodsList_clothes', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548499978550&di=1f1fd228cf709228fca93dcafabbf02e&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201510%2F24%2F20151024113616_BvLPT.jpeg'
    }, {
        name: 'MK', price: 33, category: 'goodsList_clothes', img: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=648227110,1457501216&fm=26&gp=0.jpg'
    }, {
        name: '巴宝莉', price: 44, category: 'goodsList_clothes', img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=6777935,920341325&fm=26&gp=0.jpg'
    }, {
        name: '香奈儿', price: 55, category: 'goodsList_clothes', img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548499789767&di=b4f2a12515147480cf44c7a2f7c68e78&imgtype=0&src=http%3A%2F%2Fimg.book118.com%2Fsr1%2FM00%2F28%2F31%2FwKh2AlveM9iIKYlgAB0cz4zZFTwAAP7GwG_jcwAHRzn525.jpg'
    }];
let phone =
    [{ "name": "华为", "price": 96, "category": "goodsList_phone", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497145348&di=3bb863e89625e4e4a9908f10b0752e87&imgtype=0&src=http%3A%2F%2Fimg.ithome.com%2Fnewsuploadfiles%2F2019%2F1%2F20190110_181335_636.jpg", "describe": " 华为，我的最爱" },
    { "name": "小米", "price": 33, "category": "goodsList_phone", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548495743995&di=659718ab0b1c6f85d81842fc14a2bab3&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fproduct%2F5738%2F573806%2F0.jpg", "describe": " 小米，雷猴出品" },
    { "name": "vivo", "price": 44, "category": "goodsList_phone", "img": "https://gss0.baidu.com/7LsWdDW5_xN3otqbppnN2DJv/space/pic/item/ac6eddc451da81cbdfab507d5f66d01609243135.jpg", "describe": " vivo，漂亮 " },
    { "name": "apple", "price": 55, "category": "goodsList_phone", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548495923602&di=e412b32fe23a5f08d9514f994c5b4bcd&imgtype=0&src=http%3A%2F%2Fstatic.leiphone.com%2Fuploads%2Fnew%2Farticle%2F1920_1920%2F201812%2F5c2452a4f196e.jpg%3FimageMogr2%2Fthumbnail%2F1920x%253E%2Fformat%2Fjpg%2Fquality%2F90", "describe": " apple，太贵，我不喜欢" },
    {
        "name": "魅族", "price": 56, "category": "goodsList_phone", "describe": "魅族最棒，最好", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548830755697&di=39dc073915008bfe6cb09258d86ed096&imgtype=0&src=http%3A%2F%2Fwww.cnit-research.com%2Fuploadfile%2F2018%2F1012%2F20181012031557527.jpg"
    }]
let app =
    [{ "name": "洗衣机", "price": 22, "category": "goodsList_app", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497575095&di=d4a59272c4cf53848d8b615f208a4d38&imgtype=0&src=http%3A%2F%2Fimg010.hc360.cn%2Fk1%2FM01%2F30%2F25%2F4LLd34735d9f8e3092065fBff467C42d385.png", "describe": " 洗衣机特好，洗的干净" },
    { "name": "燃气灶", "price": 33, "category": "goodsList_app", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497592730&di=21f41bd6f1ddf4178951c7cc1a59515f&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fhousephotolib%2F1610%2F13%2Fc1%2F28285254_1476289213390_690x460.jpg", "describe": " 燃气灶特好，火大" },
    { "name": "冰箱", "price": 44, "category": "goodsList_app", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497740253&di=2a66cd86af34128a3160f36597a7b4f8&imgtype=0&src=http%3A%2F%2Fpic15.photophoto.cn%2F20100610%2F0020033085457192_b.jpg", "describe": " 冰箱特好，凉" },
    {
        "name": "空调", "price": 55, "category": "goodsList_app", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497798102&di=43fb38fe2fd46d41dab6e4e9ecd66e06&imgtype=0&src=http%3A%2F%2Fsc.jb51.net%2Fuploads%2Fallimg%2F140416%2F11-14041610514b17.jpg", "describe": " 空调特好，冻死个人"
    }]
let car =
    [{ "name": "奔驰", "price": 22, "category": "goodsList_car", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548498667503&di=e4c9c03a08ad310a4d7ee606f5a2750c&imgtype=0&src=http%3A%2F%2Fabc.2008php.com%2F2016_Website_appreciate%2F2016-01-29%2F20160129001721.jpg", "describe": "产品说明xx123" },
    { "name": "宝马", "price": 33, "category": "goodsList_car", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548498729371&di=a5c603a57243a1d750808980703de6d9&imgtype=0&src=http%3A%2F%2Fassets.pushthink.com%2Fuploads%2Fphoto%2Fimage%2F372568%2F8d0d492f231a72036053639ffb250623.jpg", "describe": "产品说明xx123" },
    { "name": "奥迪", "price": 44, "category": "goodsList_car", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548498776216&di=b371c5b5bed7ad944d82d7c57864a772&imgtype=0&src=http%3A%2F%2Fi.img16888.com%2Fupload%2FImages%2F2013%2F01%2F2013010604033930126.jpg", "describe": "产品说明xx123" },
    {
        "name": "大众", "price": 55, "category": "goodsList_car", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548498827388&di=f0d0f3de9c7c88609de7ec38b35100b0&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01fa73581fd7e8a84a0d304f0b70c9.png%401280w_1l_2o_100sh.png", "describe": "产品说明xx123"
    }]

// 批量插入商品到db，只运行一次
function insertTemGoodsList(TempGoodsListObj, collectionName) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        //数据库名字
        var _dbo = db.db('proShopCart');
        //数据库集合名
        var _collection = _dbo.collection(collectionName);
        // findOne参数：查找条件，映射条件，回调函数
        _collection.insertMany(TempGoodsListObj, function (err, result) {
            if (err) throw err;
            console.log("done")
            db.close();
        });
    })
}

insertTemGoodsList(clothes, "goodsList_clothes");

insertTemGoodsList(app, "goodsList_app");

insertTemGoodsList(car, "goodsList_car");

insertTemGoodsList(phone, "goodsList_phone");


