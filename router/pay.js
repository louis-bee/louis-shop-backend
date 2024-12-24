const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/pay.js')

router.post('/',userHandler.pay)

module.exports = router