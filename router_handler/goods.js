const db = require('../db/index')

// 辅助函数：将Buffer转换为Base64字符串
function bufferToBase64(buffer, mimeType) {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}
//获取商品列表
exports.getGoods = (req,res)=>{
  const type = req.body.type
  if(type==='all') {
    const sqlStr = 'select * from goods where goods_on = 1'
    db.query(sqlStr,(err,result)=>{
      if(err) return res.cc(err)
      const goodsList = result.map(item => {
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
          goodsList
        }
      })
    })
  } else {
    const sql = 'select * from goods where goods_type=? and goods_on = 1'
    db.query(sql, type, (err,result)=>{
      if(err) {
        return res.cc(err)
      }
      
      const goodsList = result.map(item => {
        // 将图片的Buffer转换为Base64字符串
        if (item.goods_image) {
          // 假设图片是JPEG格式，如果是其他格式请替换MIME类型
          const base64Image = bufferToBase64(item.goods_image, 'image/jpg');
          item.goods_image = base64Image;
        }
        return item;
      });
      // console.log(goodsList);

      res.send({
        status: 200,
        message: '查询成功',
        data: {
          goodsList
        }
      })
    })
  }
  
}
//获取商品详情
exports.detail = (req,res)=>{
  const id = req.body.id
  const sql = 'select * from goods where goods_id=?'
  db.query(sql,id,(err,result)=>{
    if(err) {
      return res.cc(err)
    }
    const goodsList = result.map(item => {
      // 将图片的Buffer转换为Base64字符串
      if (item.goods_image) {
        // 假设图片是JPEG格式，如果是其他格式请替换MIME类型
        const base64Image = bufferToBase64(item.goods_image, 'image/jpg');
        item.goods_image = base64Image;
      }
      return item;
    })
    goodsDetail = goodsList[0]
    res.send({
      status: 200,
      message: '查询成功',
      data: {
        goodsDetail
      }
    })
  })
}