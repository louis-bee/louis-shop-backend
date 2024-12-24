const express = require('express')

const multer = require('multer')
// 配置Multer存储
const storage = multer.memoryStorage(); // 存储在内存中，也可以存储在磁盘
const upload = multer({ storage: storage });

const router = express.Router()
const manageHandler = require('../router_handler/manage.js')

router.post('/add',upload.single('image'),manageHandler.add)
router.post('/edit',upload.single('image'),manageHandler.edit)
router.post('/editnoimage',upload.single('image'),manageHandler.editnoimage)
router.post('/delete',upload.single('image'),manageHandler.delete)

module.exports = router