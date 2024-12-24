const db = require('../db/index')

exports.pay = (req,res)=>{
  const {userId} = req.body
  const sqlStr = 'select * from book where user_id = ? and book_status = 1'
  db.query(sqlStr,userId,(err,result)=>{
    if (err) {
      return res.cc(err);
    }
    const totalPrice = result.reduce((total, item) => {
      return total + item.goods_price * item.book_num
    }, 0)
    const sql2 = 'select * from user where user_id = ?'
    db.query(sql2,userId,(err,result)=>{
      if (err) {
        return res.cc(err);
      }
      const balance = result[0].user_balance
      if(balance<totalPrice) {
        const sql4 = 'update user set user_balance = 100000 where user_id = ?'
        db.query(sql4,userId,(err,result)=>{
          if (err) {
            return res.cc(err);
          }
          return res.cc('余额不足，请稍后再试',200)
        })
      } else {
        const rest = balance - totalPrice
        const sql='update book set book_status = 2 where user_id = ? and book_status = 1'
        db.query(sql,userId,(err,result)=>{
          if (err) {
            return res.cc(err);
          }
          const sql3 = 'update user set user_balance = ? where user_id = ?'
          db.query(sql3,[rest,userId],(err,result)=>{
            if (err) {
              return res.cc(err);
            }
            res.cc('支付成功',200)
          })
        })
      }
    })

  })
  
}