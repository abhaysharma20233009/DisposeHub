// src/components/Transaction/TransactionList.jsx
import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions }) => {
  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-6 shadow-xl space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800">
      {transactions.length === 0 ? (
        <p className="text-center text-gray-300 text-lg">No transactions found.</p>
      ) : (
        transactions.map((txn) => (
          <TransactionItem key={txn._id} txn={txn} />
        ))
      )}
    </div>
  );
};

export default TransactionList;
