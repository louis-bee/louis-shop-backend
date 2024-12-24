const db = require('../db/index')

// 辅助函数：将Buffer转换为Base64字符串
function bufferToBase64(buffer, mimeType) {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

//请求我的订单数据
exports.getMyorder = (req,res) =>{
  const {role,userId} = req.body
  if(role===0) {
    const sql = 'select * from book where user_id=? and book_status!=1 and book_show!=1'
    db.query(sql,userId,(err,result)=>{
      if(err) return res.cc(err)
      const orderList = result.map(item => {
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
        message: '查询用户订单成功',
        data: {
          orderList
        }
      })
    })
  } else {
    const sql = 'select * from book where book_status!=1 and book_show!=2'
    db.query(sql,(err,result)=>{
      if(err) return res.cc(err)
      const orderList = result.map(item => {
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
        message: '查询所有订单成功',
        data: {
          orderList
        }
      })
    })
  }
}

//订单显示状态通用api
exports.remove = (req,res) =>{
  const { role, bookId } = req.body
  const sql = 'select * from book where book_id = ?'
  db.query(sql,bookId, (err, result) => {
    if (err) {
      return res.cc(err);
    } 
    const show = result[0].book_show
    // console.log(role,show);
    if((role===0&&show===2)||(role===1&&show===1)) { //删除
      const sqlStr1 = 'delete from book where book_id = ?'
      db.query(sqlStr1,bookId, (err, result) => {
        if (err) {
          return res.cc(err);
        } else {
          return res.cc('已删除该订单',200)
        }
      })
    } else if(role===0&&show===3) {
      const sqlStr2 = 'update book set book_show = 1 where book_id = ?'
      db.query(sqlStr2,bookId, (err, result) => {
        if (err) {
          return res.cc(err);
        } else {
          return res.cc('已移出我的订单',200)
        }
      })
    } else if(role===1&&show===3) {
      const sqlStr3 = 'update book set book_show = 2 where book_id = ?'
      db.query(sqlStr3,bookId, (err, result) => {
        if (err) {
          return res.cc(err);
        } else {
          return res.cc('已移出订单列表',200)
        }
      })
    } else {
      return res.cc("移除失败")
    }
  })
}
//点击发货
exports.delivery = (req,res) =>{
  const { bookId } = req.body
  const sql = 'update book set book_status = 3 where book_id = ?'
  db.query(sql, bookId, (err, result) => {
    if (err) {
      return res.cc(err);
    } else {
      return res.cc('该订单已发货',200)
    }
  })
}