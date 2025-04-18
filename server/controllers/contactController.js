// controllers/contactController.js
import Contact from '../models/contactModel.js';

export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'fail',
        message: 'All fields are required'
      });
    }

    const newContact = await Contact.create({ name, email, message });

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
