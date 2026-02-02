import Transaction from "../models/transactionModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const transactionController = {

  // GET logged-in user's transactions
  getMyTransactions: catchAsync(async (req, res, next) => {
    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: {
        transactions,
      },
    });
  }),

  // GET all transactions (admin / dashboard)
  getAllTransactions: catchAsync(async (req, res, next) => {
    const transactions = await Transaction.find({ user: { $ne: null } })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (!transactions) {
      return next(new AppError("No transactions found", 404));
    }

    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: {
        transactions,
      },
    });
  }),
};

export default transactionController;
