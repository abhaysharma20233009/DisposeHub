import catchAsync from "../utils/catchAsync.js";
import Email from '../utils/email.js';
import AppError from '../utils/appError.js';
import User from "../models/userModel.js";
import walletController from "./walletController.js";
export const sendEmail = catchAsync(async (req, res, next) => {
  try {
    // await new Email().sendWelcome();
    const {uid}=req.params;
    const user =await User.findOne({firebaseUID:uid.trim()});
    //await walletController.withdraw(user);
    await user.save();
    await new Email(user).sendOnAmountTransfer();

    res.status(200).json({
      status: 'success',
      message: 'Amount Transfer message sent to User!',
    });
  } catch (err) {
    console.error('Email sending error:', err);
    return next(
      new AppError(
        'There was an error sending the email, Try again later!',
        500,
      ),
    );
  }
});
