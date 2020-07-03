import Sql = require('../infra/sql')
import { v4 as uuidv4 } from 'uuid';

export = class Transaction {
    public id: number
    public name: string
    public type: string
    public value: number
    public date: Date
    public token: string


    public constructor(id: number, name: string, type: string, value: number, date: Date, token: string) {
        this.id = id
        this.name = name
        this.type = type
        this.value = value
        this.date = date
        this.token = token

    }

    private static validar(transaction: Transaction): string {

        if (transaction.name) {
            transaction.name = transaction.name.trim()
        }

        if (transaction.type) {
            transaction.type = transaction.type.trim()
        }

        if (!transaction.name || !transaction.type || !transaction.value || isNaN(transaction.value)) {
            return 'Dados inválidos!'
        }

        if (transaction.name.length > 20) {
            return 'Nome muito longo'
        }

        return null
    }

    public static async criar(transaction: Transaction): Promise<string> {

        let erro: string = Transaction.validar(transaction)

        if (erro) {
            return erro
        }

        await Sql.conectar(async (sql: Sql) => {

            try {
                transaction.id = await sql.scalar('SELECT last_insert_id()') as number

                transaction.token = uuidv4(transaction.id)

                await sql.query(`INSERT INTO transactions (nome, tipo, valor, dia, token) 
                                VALUES (?, ?, ?, CURDATE() , ?)`, [transaction.name, transaction.type, transaction.value, transaction.token])



            } catch (e) {
                throw e
            }

        })

        return erro
    }

    public static async excluir(id: number): Promise<string> {
        let erro: string = null

        await Sql.conectar(async (sql: Sql) => {

            await sql.query('DELETE FROM transactions WHERE id = ?', [id])

            if (!sql.linhasAfetadas) {
                erro = 'Transação não encontrada'
            }
        })

        return erro
    }

    public static async listar(): Promise<Transaction[]> {
        let transactions: Transaction[] = null

        await Sql.conectar(async (sql: Sql) => {

            transactions = await sql.query('SELECT * FROM transactions') as Transaction[]

        })

        return transactions

    }
}