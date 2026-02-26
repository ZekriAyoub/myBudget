import { useEffect, useState } from 'react';
import './App.css'
import api from './api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string;
}


function App() {


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
                 300 €
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="badge badge-soft badge-success">
                <ArrowUpCircle className="w-4 h-4" size={20} />
                Revenus
              </div>
              <div className="stat-value">
                100 €
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="badge badge-soft badge-error">
                <ArrowDownCircle className="w-4 h-4" size={20} />
                Dépenses
              </div>
              <div className="stat-value">
                 200 €
              </div>
            </div>

          </div>

          <div className="flex justify-between rounded-2xl border-2 border-warning/5 border-dashed bg-warning/5 p-5">
            <div className="flex justify-between items-center mb-1">

            </div>
          </div>
 
        </div>
      </div>
    </>

  )
}

export default App
