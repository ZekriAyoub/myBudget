import { useEffect, useState } from 'react';
import '../App.css'
import supabase from '../supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import type { User } from "@supabase/supabase-js";
import { Activity, ArrowDownCircle, ArrowUpCircle, PlusCircle, Trash, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string;
}

type Props = { user: User }


function Dashboard({ user }: Props) {

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [text, setText] = useState<string>("")
  const [amount, setAmount] = useState<number | "">("")
  const [loading, setLoading] = useState<boolean>(false)

  const getTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('Transaction')
        .select('*')
      if (error) throw error

      setTransactions(data)
    } catch (error) {
      toast.error("Erreur de chargement des transactions")
      console.error(error)
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('Transaction')
        .delete()
        .eq('id', id)
      if (error) throw error

      toast.success("Transaction supprimée avec succès")
      getTransactions()
    } catch (error) {
      toast.error("Erreur de suppression de la transaction")
      console.error(error)
    }
  }

  const addTransaction = async () => {
    if (!text || amount === "" || isNaN(Number(amount))) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase
        .from('Transaction')
        .insert({
          text: text,
          amount: amount,
          user_id: user.id
        })

        if(error) throw error
      getTransactions()
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement
      modal.close()
      toast.success("Transaction ajoutée avec succès")
      setText("")
      setAmount("")
    } catch (error) {
      toast.error("Erreur d'ajout de la transaction")
      console.error(error)
    } finally {
      setLoading(false)
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
      <div className="flex justify-center items-start min-h-screen my-5 px-4">
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between rounded-2xl border-2 border-warning/5 border-dashed bg-warning/5 p-5 gap-4">
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
 
          <button className="btn btn-warning" onClick={()=>(document.getElementById('my_modal_3') as HTMLDialogElement ).showModal()}>
            <PlusCircle className="w-4 h-4" size={20} />
            Ajouter une transaction
          </button>
         
          <div className="rounded-2xl border-2 border-warning/5 border-dashed bg-warning/5">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Montant</th>
                  <th className="hidden sm:table-cell">Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>

                {transactions.map((transaction, index) => (
                <tr
                  key={transaction.id}>
                  <th>{index + 1}</th>
                  <td>{transaction.text}</td>
                  <td className="font-semibold">
                    <div className="flex items-center gap-2">
                        {transaction.amount > 0 ? 
                        ( <TrendingUp className="text-success w-6 h-6"/> ) : ( <TrendingDown className="text-error w-6 h-6"/> )}
                        {transaction.amount > 0 ? 
                        `+${transaction.amount}` : `${transaction.amount}`}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">{formatDate(transaction.created_at)}</td>
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
          <dialog id="my_modal_3" className="modal backdrop-blur">
            <div className="modal-box border-2 border-warning/10 border-dashed">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <h3 className="font-bold text-lg">Ajouter une transaction</h3>
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <label className="label">Texte</label>
                  <input type="text" name="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Entrez le texte de la transaction" className="input input-bordered w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label">Montant (négatif - dépense , positif - revenu)</label>
                  <input type="number" name="amount" value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Entrez le montant" className="input input-bordered w-full" />
                </div>
                <button className="w-full btn btn-warning" onClick={addTransaction} disabled={loading}><PlusCircle className="w-4 h-4 mr-2"/>Ajouter</button>
              </div>
            </div>
          </dialog>

        </div>
      </div>
    </>

  )
}

export default Dashboard;