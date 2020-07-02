import Sql = require ('../infra/sql')



export = class Transaction {
    public id: number;
    public name: string;
    public type: string;
    public value: number;

    public constructor (id: number, name: string, type: string, value: number){
        this.id = id
        this.name = name
        this.type = type
        this.value = value
    }

    private static validar(transaction: Transaction): string{

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

            try{
                await sql.query(`INSERT INTO transactions (nome, tipo, valor)
                 VALUES (?, ?, ?)`, [transaction.name, transaction.type, transaction.value])

                 transaction.id = await sql.scalar('SELECT last_insert_id()') as number
            } catch (e){
                throw e
            }

        })
        
        return erro
    }

    public static async excluir(id: number): Promise<string> {
        let erro: string = null

        await Sql.conectar(async (sql: Sql) => {

            await sql.query('DELETE FROM trasactions WHERE id = ?', [id])

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