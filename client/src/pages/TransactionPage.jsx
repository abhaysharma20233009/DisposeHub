// src/pages/TransactionsPage.jsx
import { useEffect, useState } from 'react';
import { fetchUserTransactions } from '../apis/transactionAPI';
import TransactionList from '../components/Transaction/TransactionList';
import Rupee from "../assets/transactionPage-bg.jpeg"; // make sure this file exists

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const getTransactions = async () => {
      const firebaseUID = localStorage.getItem("firebaseUID");
      if (!firebaseUID) return alert("User not logged in");

      try {
        const data = await fetchUserTransactions(firebaseUID.trim());
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions", err);
      }
    };

    getTransactions();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage: `url(${Rupee})`, // use the imported image here
      }}
    >
      <div className="w-full max-w-2xl bg-black/60 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">
          Your Transactions
        </h2>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export default TransactionsPage;
