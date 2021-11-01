var express = require('express');
// const { filter } = require('vue/types/umd');
var app = express();

//引入mongoDB模块
//获得它的客户端对象：MongoClient，用来连接mongoDB
var MongoClient = require('mongodb').MongoClient;

//获得连接mongoDB的字符串，变量名：DB_CONN_STR,约定俗成的，不要自己乱写
var DB_CONN_STR = 'mongodb://127.0.0.1:27017';


// 解决跨域问题

app.all("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET, DELETE,OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    //用于判断request来自ajax还是传统请求,post的跨域要用下面这句配置
    res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept");
    res.header("X-Powered-By", "3.2.1")
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//提交用户注册信息
app.post('/register_post', function (req, res) {
    // 监听，当有数据时，调用回调函数
    let _allData = ""
    req.on('data', function (_d) {
        //接收并拼接数据,此时数据是字符串
        _allData += _d;
        //console.log("type of _allData " + typeof (_allData))
    })
    // 当数据传输结束时，调用回调函数
    req.on('end', function () {
        //在接收服务器数据时一般是字符串。
        // 我们可以使用 JSON.parse() 方法将数据转换为 JavaScript 对象。
        let _registerMsg = JSON.parse(_allData)
        //1.注册新用户之前，先查询有没有同名
        findSameName(_registerMsg, res);

    })
})


//查询注册同名信息
function findSameName(_registerMsg, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        //数据库名字
        var _dbo = db.db('proShopCart');
        //数据库集合名
        var _collection = _dbo.collection('userInfo');
        // findOne参数：查找条件，映射条件，回调函数
        _collection.findOne({ "username": _registerMsg.username }, {}, function (err, result) {
            if (err) throw err;
            if (result === undefined) {
                console.log('没有同名');
                insertNewUserName(_registerMsg,res)
            } else if (result.username === _registerMsg.username) {
                console.log('名字相同')
                res.send({
                    reginfo: "用户名已经存在",
                    reg_code: 2
                });

            }

            // close databade,一定要记得，因为数据库连接口有限
            db.close();
        });
    });
}

//插入新用户注册数据
function insertNewUserName(insertMsg,res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        //数据库名字
        var _dbo = db.db('proShopCart');
        //数据库集合名
        var _collection = _dbo.collection('userInfo');
        _collection.insertOne(insertMsg, function (err) {
            if (err) throw err;
            console.log('注册成功')
            res.send({
                reginfo: "注册成功",
                reg_code: 1
            });
            //close databade,一定要记得，因为数据库连接口有限
            db.close();
        });
    });
}


//登录验证
app.post('/userLogin_post', function (req, res) {
    let _allData = ""
    req.on('data', function (_d) {
        //接收并拼接数据,此时数据是字符串
        _allData += _d;
    });

    req.on('end', function () {
        // console.log(_allData)
        let loginMsg = JSON.parse(_allData);
        MongoClient.connect(DB_CONN_STR, function (err, db) {
            //数据库名字
            var _dbo = db.db('proShopCart');
            //数据库集合名
            var _collection = _dbo.collection('userInfo');
            // findOne参数：查找条件，映射条件，回调函数
            _collection.findOne({ "username": loginMsg.username }, {}, function (err, result) {
                if (err) throw err;
                if (result === undefined) {
                    //用户不存在
                    console.log("用户名错误")
                    res.send({
                        login_info: "用户名错误",
                        login_code: 1,
		
                    });
                } else if (result.username === loginMsg.username) {
                    if (result.password !== loginMsg.password) {
                        console.log('用户名与密码不匹配');
                        res.send({
		//这种提示信息最好写在前端
                            login_info: "用户名与密码不匹配",
                            login_code: 2
                        });
                    } else if (result.password === loginMsg.password) {
                        console.log('登录成功');
                        return res.send({
                            login_info: "登录成功",
                            login_code: 3,
                            userinfo: result
                        });
                    }
                }
                // close databade,一定要记得，因为数据库连接口有限
                db.close();
            });
        });
    })
})

app.post("/insertGoods", function (req, res) {
    let _addData = ""
    req.on('data', function (_d) {
        //接收并拼接数据,此时数据是字符串
        _addData += _d;
    });
    req.on("end", function (_d) {
        let insertGoods = JSON.parse(_addData);
        // console.log(insertGoods)
        MongoClient.connect(DB_CONN_STR, function (err, db) {
            //数据库名字
            var _dbo = db.db('proShopCart');
            //数据库集合名
            var _collection = _dbo.collection('goodsCategory');
            // findOne参数：查找条件，映射条件，回调函数
            _collection.insertMany(insertGoods, function (err, result) {
                if (err) throw err;
                console.log('录入成功')
                res.send({
                    insertCode: 5
                })

                // close databade,一定要记得，因为数据库连接口有限
                db.close();

            });
        })
    })
})

// 获取商品大类信息
app.get("/getGoodsCategory", function (req, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        //数据库名字
        var _dbo = db.db('proShopCart');
        //数据库集合名
        var _collection = _dbo.collection('goodsCategory');
        // 连表查询aggregate
        _collection.aggregate([{
           $lookup: {
                localField: "describe",
                from: "goodsList_app",
                foreignField: "category",
                as: "goodsList_appList"}
            },{
            $lookup: {
                localField: "describe",
                from: "goodsList_phone",
                foreignField: "category",
                as: "goodsList_phoneList"}
            },{
            $lookup: {
                localField: "describe",
                from: "goodsList_clothes",
                foreignField: "category",
                as: "goodsList_clothesList"}
            },{
            $lookup: {
                localField: "describe",
                from: "goodsList_car",
                foreignField: "category",
                as: "goodsList_carList"
            }
        }]).toArray(function (err, result) {
            if (err) throw err;
            return res.send(result);
	console.log("done")
            db.close();
        });
    })
})

//用id查找商品详情页数据
app.get("/getGoodsInfo", function (req, res) {
    var _findId = req.query._id;
    var _findCol = req.query._findCollection

    //生成mongoDB的id对象
    var _ObjectId = require('mongodb').ObjectId;
    var _ObjId = _ObjectId.createFromHexString(_findId);
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        //数据库名字
        var _dbo = db.db('proShopCart');
        //数据库集合名
        var _collection = _dbo.collection(_findCol);
        // findOne参数：查找条件，映射条件，回调函数
        _collection.findOne({ "_id": _ObjId }, {}, function (err, result) {
            if (err) throw err;
            // close databade,一定要记得，因为数据库连接口有限
            return res.send(result);
            db.close();
        });
    });
})

//侧边栏信息
app.get("/getGoodsListData", function (req, res) {
    //集合名
    var _c = req.query.categoryName;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        //数据库名字
        var _dbo = db.db('proShopCart');
        //数据库集合名
        var _collection = _dbo.collection(_c);
        // findOne参数：查找条件，映射条件，回调函数
        _collection.find().toArray(function (err, result) {
            if (err) throw err;
            // close databade,一定要记得，因为数据库连接口有限
            return res.send(result);
	db.close();
        });
        
    });
});

//分页数据
app.get("/getPageChange", function (req, res) {
    let collectionName = req.query._c
    let startPage = req.query.startNum
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        //数据库名字
        var _dbo = db.db('proShopCart');
        //数据库集合名
        var _collection = _dbo.collection(collectionName);
        // limit(3)限制返回两条，skip(Number(startPage))，跳过的条数
        _collection.find().limit(3).skip(Number(startPage)).toArray(function (err, result) {
            if (err) throw err;
            // close databade,一定要记得，因为数据库连接口有限
            return res.send(result);
            db.close();
        });
    });
})

// 搜索栏
app.get("/search", function (req, res) {
    var _find = req.query._searchValue;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        //数据库名字
        var _dbo = db.db('proShopCart');
        //数据库集合名
        var _collection = _dbo.collection("goodsList_phone");
        // findOne参数：查找条件，映射条件，回调函数
        _collection.findOne({ "name": _find }, {}, function (err, result) {
            if (err) throw err;
            // close databade,一定要记得，因为数据库连接口有限
            res.send(result);
            db.close();
        });
    });
})
app.listen(5678, function () {
    console.log('5678中间件已经启动')
});