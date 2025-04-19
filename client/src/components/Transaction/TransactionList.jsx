// src/components/Transaction/TransactionList.jsx
import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions }) => {
  return (
    <div className="grid gap-4">
      {transactions.map(txn => (
        <TransactionItem key={txn._id} txn={txn} />
      ))}
    </div>
  );
};

export default TransactionList;
