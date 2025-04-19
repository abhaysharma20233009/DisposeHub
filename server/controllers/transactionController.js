import Transaction from '../models/transactionModel.js';
import User from '../models/userModel.js';

const transactionController = {
  getTransactions: async (req, res) => {
    try {
      const user = await User.findOne({ firebaseUID: req.params.firebaseUID });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const transactions = await Transaction.find({ user: user._id }).sort({ date: -1 });
      res.status(200).json({ transactions });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
} 

export default transactionController;