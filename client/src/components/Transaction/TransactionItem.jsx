const TransactionItem = ({ txn }) => {
  const isWithdrawal = txn.type === "withdrawal";
  const amountColor = isWithdrawal ? "text-red-400" : "text-green-400";
  const gradientBorder = isWithdrawal
    ? "border-red-500"
    : "border-green-500";

  return (
    <div
      className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border ${gradientBorder} backdrop-blur-md rounded-2xl p-5 shadow-lg flex justify-between items-center transition-transform hover:scale-[1.02] duration-300`}
    >
      
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full blur-md animate-ping opacity-50" />

      <div>
        <h3 className="text-xl font-semibold capitalize text-cyan-400">
          {txn.type}
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {new Date(txn.date).toLocaleString()}
        </p>
      </div>

      <div className={`text-xl font-bold ${amountColor}`}>
        ₹{txn.amount.toFixed(2)}
      </div>
    </div>
  );
};

export default TransactionItem;
