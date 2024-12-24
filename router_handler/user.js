const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
//注册
exports.register = (req,res)=>{
  const userinfo = req.body.form
  if(!userinfo.email||!userinfo.username||!userinfo.password) {  //检查信息是否为空
    return res.cc('信息不能为空')
  }
  const sqlStr = 'select * from user where user_account=?'
  db.query(sqlStr,userinfo.email,(err,result)=>{  //查询是由有同名账号
    if(err) return res.cc(err)
    if(result.length>0) { 
      return res.cc('该账号已被注册')
    }
    userinfo.password = bcrypt.hashSync(userinfo.password,10)  //将密码转换为哈希值
    const sql = 'insert into user set ?'  //定义插入user表的语句
    db.query(sql,{user_account:userinfo.email,user_name:userinfo.username,user_password:userinfo.password,user_balance:100000},(err,result)=>{
      if(err) return res.cc(err)
      if(result.affectedRows!==1) return res.cc('注册失败')
      res.cc('注册成功',200 )    
    })
  })
}

//登录
exports.login = (req,res)=>{
  // console.log(req.body.form);
  const userinfo = req.body.form
  if(!userinfo.email||!userinfo.password) {
    // return res.send({status:1,message:'不合法'})
    return res.cc('不合法')
  }
  const sql = `select * from user where user_account=?`
  db.query(sql,userinfo.email,(err,result)=>{
    // if(err) return res.send({status:1,message:err.message})
    if(err) return res.cc(err)
    if(result.length!==1) return res.cc('登录失败')
    const compareResult = bcrypt.compareSync(userinfo.password,result[0].user_password)
    if(!compareResult) return res.cc('登录失败')
    //登录成功 生产Token
    const user = {...result[0],user_password:''}
    const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
    res.send({
      status: 200,
      message: '登录成功',
      data: {
        userId: result[0].user_id,
        userAccount: result[0].user_account,
        userName: result[0].user_name,
        token: 'Bearer '+tokenStr
        // token: tokenStr
      }
    })
  })
}