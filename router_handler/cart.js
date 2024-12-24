const db = require('../db/index')

// 辅助函数：将Buffer转换为Base64字符串
function bufferToBase64(buffer, mimeType) {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

//添加至购物车
exports.addToCart = (req,res)=> {
  const orderinfo = req.body
  // console.log(orderinfo);

  const sqlStr = 'select * from goods where goods_id=?'
  db.query(sqlStr,orderinfo.goodsId,(err,result)=>{
    if(err) {
      return res.cc(err)
    }
    if(result.length<1) {
      return res.cc('查询不到商品')
    }
    const price = result[0].goods_price
    const image = result[0].goods_image
    const goodsname = result[0].goods_name
    const sqlStr2 = 'select * from user where user_id=?'
    db.query(sqlStr2,orderinfo.userId,(err,result)=>{
      if(err) {
        return res.cc(err)
      }
      if(result.length<1) {
        return res.cc('查询不到用户')
      }
      //查询是否已经有购物车
      const sqlStr4 = 'select * from book where user_id = ? and goods_id = ? and book_status = 1'
      db.query(sqlStr4,[orderinfo.userId,orderinfo.goodsId],(err,result)=>{
        if(err) return res.cc(err)
        if(result.length===0) { //正常添加
          const sqlStr3 = 'insert into book set ?'
          db.query(sqlStr3,{user_id:orderinfo.userId,goods_id:orderinfo.goodsId,goods_price:price,book_num:orderinfo.num,book_status:1,goods_name:goodsname,goods_image:image},(err,result)=>{
            if(err) return res.cc(err)
            if(result.affectedRows!==1) return res.cc('添加失败')
            return res.send({
              status: 200,
              message: '添加成功',
              data: {
                addtype: 1,
              }
            })      
          })
        } else { //添加数量
          const bookId = result[0].book_id
          const newBookNum = orderinfo.num + result[0].book_num
          const sqlStr5 = 'update book set book_num = ? where book_id = ?'
          db.query(sqlStr5,[ newBookNum, bookId] ,(err,result)=>{
            if(err) return res.cc(err)
            // if(result.affectedRows!==1) return res.cc('添加失败')
            return res.send({
              status: 200,
              message: '添加成功',
              data: {
                addtype: 0,
              }
            })    
          })
        }

      })

      
    }) 
  })
  
}
//请求购物车数据
exports.getCart = (req,res) =>{
  const userId = req.body.id
  const sql = 'select * from book where book_status=1 and user_id=?'
  db.query(sql,userId,(err,result)=>{
    if(err) return res.cc(err)
    const cartList = result.map(item => {
      // 将图片的Buffer转换为Base64字符串
      if (item.goods_image) {
        // 假设图片是JPEG格式，如果是其他格式请替换MIME类型
        const base64Image = bufferToBase64(item.goods_image, 'image/jpg');
        item.goods_image = base64Image;
      }
      return item;
    }); 
    res.send({
      status: 200,
      message: '查询成功',
      data: {
        cartList
      }
    })
  })
}
//更新购物车数据
exports.updateCart = (req,res) =>{
  const { userId, cartList } = req.body
  // console.log(userId);
  // console.log(cartList);
  // const test1 = cartList[1]
  const sql = 'UPDATE book SET goods_id = ?, goods_price = ?, book_num = ?, book_status = ?, goods_name = ?, goods_image = ? WHERE book_id = ?';
  // db.query(sql,[
  //         test1.goods_id,
  //         test1.goods_price,
  //         test1.book_num,
  //         test1.book_status,
  //         test1.goods_name,
  //         test1.goods_image,
  //         test1.book_id,
  //       ],(err,result)=>{
  //         if(err) res.cc(err)
  //         res.send('okok')
  //       })
  const updatePromises = cartList.map(item => {
    return new Promise((resolve, reject) => {
      const sqlStr='select * from goods where goods_id=?'
      db.query(sqlStr,item.goods_id,(err,result)=>{
        const image = result[0].goods_image
        const price = result[0].goods_price
        const name = result[0].goods_name
        db.query(sql, [
          item.goods_id,
          price,
          item.book_num,
          item.book_status,
          name,
          image,
          item.book_id,
        ], (err, result) => {
          if (err) {
            reject(err);
          } else {
            // console.log(`Updated book item: ${result.affectedRows} rows affected`);
            resolve(result);
          }
        })
      })
    })
  })
  // 等待所有更新操作完成
  Promise.all(updatePromises)
    .then(results => {
      res.cc('更新成功',200);
    })
    .catch(err => {
      console.error('Error updating cart:', err);
      res.status(500).send('Error updating cart');
    });
}
//只修改数量
exports.updateSingleCart = (req,res) =>{
  const { userId, bookId, bookNum } = req.body
  const sql = 'UPDATE book SET book_num = ? WHERE book_id = ?';
  db.query(sql, [bookNum, bookId], (err, result) => {
    if (err) {
      res.cc(err);
    } else {
      res.cc('更新数量成功',200)
    }
  })
}
//移出购物车
exports.remove = (req,res) =>{
  const { bookId } = req.body
  const sql = 'delete from book where book_id = ?';
  db.query(sql,bookId, (err, result) => {
    if (err) {
      res.cc(err);
    } else {
      res.cc('已移出购物车',200)
    }
  })
}
//购物车数量
exports.num = (req,res) =>{
  const { id } = req.body
  const sql = 'select * from book where user_id = ? and book_status = 1';
  db.query(sql,[id], (err, result) => {
    if (err) {
      res.cc(err);
    } else {
      const num = result.length
      res.send({
        status: 200,
        message: '查询成功',
        data: {
          num
        }
      })
    }
  })
}
//
exports.editCart = (req,res) =>{

}