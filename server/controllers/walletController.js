import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import Email from "../utils/email.js";
const walletController = {
  rewardUser: async (req, res) => {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.walletBalance += amount;
    await user.save();

    await Transaction.create({
      user: user._id,
      amount,
      type: "reward",
    });

    res
      .status(200)
      .json({ message: "Reward added", walletBalance: user.walletBalance });
  },

  withdraw: async (req, res) => {
    const user = req.user;
    const { amount } = req.body;

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { walletBalance: -amount } },
      { new: true },
    );

    // try{
    //   await new Email(user,amount).sendOnAmountTransfer();
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
      amount,
      type: "withdrawal",
    });

    res.status(200).json({
      status: "success",
      walletBalance: updatedUser.walletBalance,
      message: "Amount Transfer message sent to User!",
    });
  },
};

export default walletController;
