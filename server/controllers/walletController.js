import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import Email from "../utils/email.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const walletController = {
  // ADMIN / SYSTEM REWARD
  rewardUser: catchAsync(async (req, res) => {
    const { userId, amount } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { walletBalance: amount } },
      { new: true },
    );

    await Transaction.create({
      user: userId,
      amount,
      type: "CREDIT",
      source: "REWARD",
      description: "Reward credited to wallet",
    });

    res.status(200).json({
      status: "success",
      message: "Reward added successfully",
      walletBalance: user.walletBalance,
    });
  }),

  withdraw: catchAsync(async (req, res) => {
    const user = req.user;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return next(new AppError("Invalid withdrawal amount", 400));
    }

    if (user.walletBalance < amount) {
      return next(new AppError("Insufficient wallet balance", 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { walletBalance: -amount } },
      { new: true },
    );

    // try{
    //   const logoUrl = `${req.protocol}://${req.get("host")}/logo/logo.png`;
    //   const dashboardURL = `${process.env.FRONTEND_URL}/dashboard`;
    //   await new Email(user, dashboardURL, { logoUrl, amount }).sendOnAmountTransfer();
    // }catch (err) {
    //   console.error('Email sending error:', err);
    //   return next(
    //     new AppError(
    //       'There was an error sending the email, Try again later!',
    //       500,
    //     ),
    //   );
    // }

    await Transaction.create({
      user: user._id,
      amount: amount,
      type: "DEBIT",
      source: "WITHDRAW",
      description: "Wallet withdrawal",
    });

    res.status(200).json({
      status: "success",
      walletBalance: updatedUser.walletBalance,
      message: "Amount Transfer message sent to User!",
    });
  }),
};

export default walletController;
