const express = require('express')
const cors = require('cors')
const productRoutes = require('./routes/productRoutes')
require('./services/cronService')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/product', productRoutes)

app.listen(3000, () => console.log('Сервер работает на http://localhost:3000'))
