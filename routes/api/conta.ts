import express = require('express')
import wrap = require('express-async-error-wrapper')
import Sql = require('../../infra/sql')
import Conta = require('../../models/conta') 
import Transaction = require('../../models/conta')

const router = express.Router()

router.get('/listar', wrap(async (req, res) => {
    let transactions = await Conta.listar()

    res.json(transactions)


}))

router.get('/excluir/:id', wrap(async (req, res) => {

    const  id = parseInt(req.params['id'])

    if (isNaN(id)) {
        res.status(400).json('Id inválido')
        return
    }

    let erro = await Transaction.excluir(id)

    if (erro) {
        res.status(400).json(erro)
        return
    }

    res.sendStatus(204)
}))

router.post('/criar', wrap(async (req,res) => {
    let transaction = req.body as Transaction

    let erro = await Transaction.criar(transaction)

    if (erro) {
        res.status(400).json(erro)
        return
    }

    res.json(transaction.id)
}))

export = router





