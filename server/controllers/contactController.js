// controllers/contactController.js
import Contact from '../models/contactModel.js';
import User from '../models/userModel.js';

export const submitContactForm = async (req, res, next) => {
  try {
    const {uid}=req.params;
    const user=await User.findOne({firebaseUID:uid.trim()});
    
    const { message } = req.body;
    if ( !message) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please Enter your message'
      });
    }
    if(!user){
      return res.stuts(404).json({
        ststus:"fail",
        message:"user not found"
      })
    }

    const newContact = await Contact.create({ name:user.name, email:user.email, role: user.role, message, });

    res.status(201).json({
      status: 'success',
      message: 'Message sent successfully!',
      data: newContact
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};
