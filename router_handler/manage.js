const db = require('../db/index')
const db2 = require('../db/db2')

//添加商品
exports.add = (req,res) =>{
  // console.log(req.body);
  const image = req.file
  // console.log(image);
  const goodsinfo = req.body
  // console.log(goodsinfo);
  if(!goodsinfo.name||!goodsinfo.price||!image||!goodsinfo.type) {
    // return res.send({status:1,message:'不合法'})
    return res.cc('不能为空')
  }
  const sqlStr = 'select * from goods where goods_name=?'
  db.query(sqlStr,goodsinfo.name,(err,result)=>{
    if(err) {
      // return res.send({status:1,message:err.message})
      return res.cc(err)
    }
    if(result.length>0) { 
      // return res.send({status:1,message:'该账号已被注册'})
      return res.cc('商品重名')
    }
    const imageBuffer = req.file.buffer
    const sql = 'insert into goods set ?'
    db.query(sql, { goods_name:goodsinfo.name, goods_price:goodsinfo.price, goods_description:goodsinfo.description, goods_image:imageBuffer, goods_type:goodsinfo.type},(err,result)=>{
      // if(err) return res.send({status:1,message:err.message})
      if(err) return res.cc(err)
      if(result.affectedRows!==1) return res.cc('添加失败')
      res.cc('添加成功',200 )
    })
  })
}

//编辑商品
exports.edit = (req,res) =>{
  const image = req.file
  const goodsinfo = req.body
  const imageBuffer = req.file.buffer
  
  if(!goodsinfo.name||!goodsinfo.price||!image||!goodsinfo.type||!goodsinfo.description) {
    return res.cc('信息不全')
  }
  const sqlStr = 'select * from goods where goods_id=?'
  db.query(sqlStr,goodsinfo.id,(err,result)=>{
    if(err) {
      return res.cc(res.message)
    }
    if(result.length>0) { 
      //更新商品数据库
      const sql = 'UPDATE goods SET goods_name = ?, goods_price = ?, goods_description = ?, goods_image = ?, goods_type = ? WHERE goods_id = ?'
      db.query(sql, [goodsinfo.name, goodsinfo.price, goodsinfo.description, imageBuffer, goodsinfo.type, goodsinfo.id],(err,result)=>{
        if(err) return res.cc(res.message)
        if(result.affectedRows!==1) return res.cc('修改失败')
        //更新订单数据库
        const sql2 = 'UPDATE book SET goods_name = ?, goods_price = ?, goods_image = ? WHERE goods_id = ? and book_status = 1'
        db.query(sql2, [goodsinfo.name, goodsinfo.price, imageBuffer, goodsinfo.id],(err,result)=>{
          if(err) return res.cc(res.message)
          return res.cc('修改订单数据库成功',200 )
        })
      })
    } else {
      res.cc('查询不到该商品，修改失败')
    }
  })
}
//编辑商品（没有图片版
exports.editnoimage = (req,res) =>{
  const goodsinfo = req.body
  if(!goodsinfo.name||!goodsinfo.price||!goodsinfo.type||!goodsinfo.description) {
    return res.cc('信息不全')
  }
  const sqlStr = 'select * from goods where goods_id=?'
  db.query(sqlStr,goodsinfo.id,(err,result)=>{
    if(err) {
      return res.cc(res.message)
    }
    if(result.length>0) { 
      //更新商品数据库
      const sql = 'UPDATE goods SET goods_name = ?, goods_price = ?, goods_description = ?, goods_type = ? WHERE goods_id = ?'
      db.query(sql, [goodsinfo.name, goodsinfo.price, goodsinfo.description, goodsinfo.type, goodsinfo.id],(err,result)=>{
        if(err) return res.cc(res.message)
        if(result.affectedRows!==1) return res.cc('修改失败')
        //更新订单数据库
        const sql2 = 'UPDATE book SET goods_name = ?, goods_price = ? WHERE goods_id = ? and book_status = 1'
        db.query(sql2, [goodsinfo.name, goodsinfo.price, goodsinfo.id],(err,result)=>{
          if(err) return res.cc(res.message)
          return res.cc('修改订单数据库成功',200 )
        })
      })
    } else {
      res.cc('查询不到该商品，修改失败')
    }
  })
}
// //下架/删除商品
// exports.delete = async (req,res) =>{
//   const { goodsId , token } = req.body
//   const sql='update goods set goods_on = 0 where goods_id = ?'
//   await db.query(sql,goodsId,async (err,result)=>{
//     if(err) {
//       return res.cc(err)
//     }
//     const sqlStr='select * from book where goods_id = ?'
//     await db.query(sqlStr,goodsId,async (err,result)=>{
//       if(err) {
//         return res.cc(err)
//       }
//       if(result.length===0) {
//         const sqlStr2='delete from goods where goods_id = ?'
//         await db.query(sqlStr2,goodsId,(err,result)=>{
//           if(err) {
//             return res.cc(err)
//           }
//           if(result.affectedRows!==1) {
//             return res.cc('删除商品失败')
//           }
//           return res.cc('已下架并删除该商品',200)
//         })
//       } else {
//         return res.cc('已下架该商品',200)
//       }
//     })
//   })
// }

// 删除商品的路由处理函数
exports.delete = async (req, res) => {
  const { goodsId } = req.body;
  try {
    // 下架商品
    await db2.query('UPDATE goods SET goods_on = 0 WHERE goods_id = ?', [goodsId]);
    // 检查是否有关联的图书
    const [booksResult] = await db2.query('SELECT * FROM book WHERE goods_id = ?', [goodsId]);
    if (booksResult.length === 0) {
      // 如果没有关联的图书，删除商品
      const [deleteResult] = await db2.query('DELETE FROM goods WHERE goods_id = ?', [goodsId]);
      if (deleteResult.affectedRows !== 1) {
        return res.cc('删除商品失败', 400);
      }
      return res.cc('已下架并删除该商品', 200);
    } else {
      return res.cc('已下架该商品', 200);
    }
  } catch (err) {
    return res.cc(err.message, 500);
  }
};