const express = require('express')
const router = express.Router()
const controller = require('../controllers/productController')

router.post('/add', controller.add)
router.get('/all', controller.all)
router.delete('/delete/:id', controller.delete)
router.put('/update/:id', controller.update)
router.get('/expiring', controller.expiring)

module.exports = router
