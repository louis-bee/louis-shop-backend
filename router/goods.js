const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/goods.js')

router.post('/goods',userHandler.getGoods)

router.post('/detail',userHandler.detail)

module.exports = router