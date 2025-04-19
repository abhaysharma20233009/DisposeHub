// src/pages/TransactionsPage.jsx
import { useEffect, useState } from 'react';
import { fetchUserTransactions } from '../apis/transactionAPI';
import TransactionList from '../components/Transaction/TransactionList';

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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Transactions</h2>
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default TransactionsPage;
