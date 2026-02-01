import Transaction from "../models/transactionModel.js";

const transactionController = {

  // GET logged-in user's transactions

  getMyTransactions: async (req, res) => {
    try {
      const transactions = await Transaction.find({
        user: req.user._id,
      }).sort({ date: -1 });

      res.status(200).json({
        status: "success",
        results: transactions.length,
        data: {
          transactions,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Error fetching transactions",
      });
    }
  },

  // GET all transactions (admin / dashboard)

  getAllTransactions: async (req, res) => {
    try {
      const transactions = await Transaction.find({ user: { $ne: null } })
        .populate("user", "name email")
        .sort({ date: -1 });

      res.status(200).json({
        status: "success",
        results: transactions.length,
        data: {
          transactions,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Error fetching all transactions",
      });
    }
  },
};

export default transactionController;
