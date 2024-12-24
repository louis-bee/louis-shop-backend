const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/cart.js')

router.post('/add',userHandler.addToCart)
router.post('/getCart',userHandler.getCart)
router.post('/updateCart',userHandler.updateCart)
router.post('/updateSingleCart',userHandler.updateSingleCart)
router.post('/remove',userHandler.remove)
router.post('/num',userHandler.num)
router.post('/edit',userHandler.editCart)

module.exports = router