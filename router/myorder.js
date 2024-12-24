const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/myorder.js')

router.post('/getMyorder',userHandler.getMyorder)
router.post('/remove',userHandler.remove)
router.post('/delivery',userHandler.delivery)

module.exports = router