import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },
    source: {
      type: String,
      enum: ["REWARD", "WITHDRAW"],
      required: true,
    },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);


