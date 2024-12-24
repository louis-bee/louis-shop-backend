const express= require("express");
const path = require('path');
const app = express()
const port = 3007
//导入cors中间件
const cors = require('cors')
app.use(cors())

// app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({extended:false}))

//history
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//在路由前封装res.cc
app.use((req,res,next)=>{
  res.cc = function(err,status=500) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

//在路由前配置解析token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({
  path: [/^\/api/] //定义不需要进行身份验证的请求前缀
}));
// path: [/^\/api/, /^\/manage/, /^\/cart/ ,/^\/pay/ ,/^\/myorder/]
// app.use(expressJWT({secret: config.jwtSecretKey}).unless({path:[/^\/api/]}))
// app.use(expressJWT({secret: config.jwtSecretKey}).unless({path:[/^\/manage/]}))

//导入并使用用户路由模块
const userRouter =  require('./router/user')
app.use('/api',userRouter)
//导入并使用管理商品的路由模块
const manageRouter = require('./router/manage')
app.use('/manage',manageRouter)
//导入请求商品信息的路由模块
const goodsRouter = require('./router/goods')
app.use('/api',goodsRouter)
//导入编辑用户订单的路由模块
const cartRouter = require('./router/cart')
app.use('/cart',cartRouter)
//导入支付的路由模块
const payRouter = require('./router/pay')
app.use('/pay',payRouter)
//导入我的订单的路由模块
const myorderRouter = require('./router/myorder')
app.use('/myorder',myorderRouter)

//定义错误级别的中间件
app.use((err,req,res,next)=>{
  if(err.name==='UnauthorizedError') return res.cc('身份验证失败') //身份认证失败后的错误
  res.send({status:500,message:err.message})
})


app.listen(port,()=>{
  console.log(`api server running at Localhost:${port}`);
  
})