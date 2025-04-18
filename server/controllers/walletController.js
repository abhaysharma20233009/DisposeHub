import User from '../models/userModel.js';
import Transaction from '../models/transactionModel.js';

const walletController = {
  rewardUser: async (req, res) => {
    const { userId, amount } = req.body;
  
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    user.walletBalance += amount;
    await user.save();
  
    await Transaction.create({
      user: user._id,
      amount,
      type: 'reward'
    });
  
    res.status(200).json({ message: 'Reward added', walletBalance: user.walletBalance });
  },

  withdraw: async (req, res) => {
    const { userId, amount } = req.body;
  
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
  
    user.walletBalance -= amount;
    await user.save();
  
    await Transaction.create({
      user: user._id,
      amount,
      type: 'withdrawal'
    });
  
    res.status(200).json({ message: 'Withdrawal successful', walletBalance: user.walletBalance });
  }
}

export default walletController


