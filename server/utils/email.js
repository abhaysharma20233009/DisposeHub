import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';
import catchAsync from './catchAsync.js';
import dotenv from 'dotenv';
dotenv.config();

class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.from = `${process.env.EMAIL_FROM}`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // false for port 587
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    // If needed, you can enable the fallback mailtrap configuration
    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 587, // 587 is commonly used for STARTTLS
      secure: false, // For STARTTLS, this should be false
      auth: {
        user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1) Get the current directory path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // 2) Render HTML based on a pug template
    let html = "";
    if (template === 'welcome') {
      html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        subject,
      });
    } else {
      html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        amount: 5000,
        date: '18-Apr-2025',
        referenceId: 'TXN12345678',
        url: 'http://localhost:5173/profile',
        subject,
      });
    }

    // 3) Define the email options
    const mailOptions = {
      from: this.from, 
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // 4) Create a transport and send the email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Clean India Family');
  }

  async sendOnAmountTransfer() {
    await this.send('amountCredit', 'Amount Transfer Successful');
  }
};

export default Email;
