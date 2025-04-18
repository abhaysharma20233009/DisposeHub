import catchAsync from "../utils/catchAsync.js";
import Email from '../utils/email.js';
import AppError from '../utils/appError.js';

export const sendEmail = catchAsync(async (req, res, next) => {
  try {
    // await new Email().sendWelcome();
    await new Email().sendOnAmountTransfer();

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
