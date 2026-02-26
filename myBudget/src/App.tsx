import { useEffect, useState } from 'react';
import './App.css'
import supabase from './api';
import toast, { Toaster } from 'react-hot-toast';
import { Activity, ArrowDownCircle, ArrowUpCircle, Trash, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string;
}


function App() {

  const [transactions, setTransactions] = useState<Transaction[]>([])

  const getTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('Transaction')
        .select('*')
      console.log(data)
      if (error) throw error

      setTransactions(data)
    } catch (error) {
      toast.error("Erreur de chargement des transactions")
      console.error(error)
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('Transaction')
        .delete()
        .eq('id', id)
      console.log(data)
      if (error) throw error

      toast.success("Transaction supprimée avec succès")
      getTransactions()
    } catch (error) {
      toast.error("Erreur de suppression de la transaction")
      console.error(error)
    }
  }

  useEffect(() => {
    getTransactions()
  }, [])

  const amounts = transactions.map(t => Number(t.amount) || 0)
  const balance = amounts.reduce((acc, item) => acc + item, 0) || 0

  const income = amounts.filter(a => a > 0).reduce((acc, item) => acc + item, 0) || 0
  const expense = amounts.filter(a => a < 0).reduce((acc, item) => acc + item, 0) || 0
  const ratio = income > 0 ? Math.min((Math.abs(expense) / income) *100, 100) : 0

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour : '2-digit',
      minute : '2-digit'
    })
  }


  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div className="flex justify-center items-center min-h-screen my-5">
        <div className="w-2/3 flex flex-col gap-4">
          <div className="flex justify-between rounded-2xl border-2 border-warning/5 border-dashed bg-warning/5 p-5">
            <div className="flex flex-col gap-1">
              <div className="badge badge-soft">
                <Wallet className="w-4 h-4" size={20} />
                Votre solde
              </div>
              <div className="stat-value">
                {balance.toFixed(2)} €
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="badge badge-soft badge-success">
                <ArrowUpCircle className="w-4 h-4" size={20} />
                Revenus
              </div>
              <div className="stat-value">
                {income.toFixed(2)}€
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="badge badge-soft badge-error">
                <ArrowDownCircle className="w-4 h-4" size={20} />
                Dépenses
              </div>
              <div className="stat-value">
                 {expense.toFixed(2)} €
              </div>
            </div>

          </div>

          <div className="rounded-2xl border-2 border-warning/5 border-dashed bg-warning/5 p-5">
            <div className="flex justify-between items-center mb-1">
              <div className="badge badge-soft badge-warning gap-1">
                <Activity className="w-4 h-4" />
                Dépenses VS Revenus
              </div>
              <div> 
                {ratio.toFixed(0)} %
              </div>
            </div>
            <progress className="progress progress-warning w-full" value={ratio} max={100}></progress>
          </div>
 
          <button ></button>
          <div className="rounded-2xl border-2 border-warning/5 border-dashed bg-warning/5">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Montant</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>

                {transactions.map((transaction, index) => (
                <tr
                  key={transaction.id}>
                  <th>{index + 1}</th>
                  <td>{transaction.text}</td>
                  <td className="font-semibold flex items-center gap-2">
                    {transaction.amount > 0 ? 
                    ( <TrendingUp className="text-success w-6 h-6"/> ) : ( <TrendingDown className="text-error w-6 h-6"/> )}
                    {transaction.amount > 0 ? 
                    `+${transaction.amount}` : `-${transaction.amount}`}
                  </td>
                  <td>{formatDate(transaction.created_at)}</td>
                  <td>
                    <button className="btn btn-sm btn-error btn-soft" 
                      title="Supprimer"
                      onClick={() => deleteTransaction(transaction.id)}>
                      <Trash className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
                ))}
                


              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>

  )
}

export default App
