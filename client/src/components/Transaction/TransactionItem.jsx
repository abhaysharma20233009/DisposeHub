// src/components/Transaction/TransactionItem.jsx
const TransactionItem = ({ txn }) => {
  return (
    <div className="p-4 border shadow rounded-xl flex justify-between items-center bg-white">
      <div>
        <h3 className="font-semibold capitalize">{txn.type}</h3>
        <p className="text-sm text-gray-500">{new Date(txn.date).toLocaleString()}</p>
      </div>
      <div className={`font-bold text-lg ${txn.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}`}>
        ₹{txn.amount.toFixed(2)}
      </div>
    </div>
  );
};

export default TransactionItem;
