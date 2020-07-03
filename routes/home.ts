import express = require('express')
import wrap = require('express-async-error-wrapper')
import Conta = require('../models/conta')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')

})

router.get('/nova-transacao', (req, res) =>{
    res.render('nova-trans')
})

export = router