import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { convert } from 'html-to-text';
import dotenv from 'dotenv';
dotenv.config();

class Email {
  constructor(user, url = null, extraData = {}) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.from = `${process.env.EMAIL_FROM}`;
    this.url = url;
    this.extraData = extraData;
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

    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
      port: process.env.MAILTRAP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  // Read HTML file from views/email folder
  loadTemplate(templateName) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const templatePath = join(__dirname, '../views/email', `${templateName}.html`);

    let html = fs.readFileSync(templatePath, 'utf-8');

    // Replace template placeholders with actual values
    html = html.replace(/{{firstName}}/g, this.firstName || '');
    html = html.replace(/{{amount}}/g, this.extraData.amount || '');
    html = html.replace(/{{date}}/g, new Date().toLocaleString());
    html = html.replace(/{{referenceId}}/g, 'TXN2025041912345678');
    html = html.replace(/{{url}}/g, this.url || 'http://localhost:5173/profile');
    html = html.replace(/{{appName}}/g, 'DisposeHub');
    html = html.replace(/{{logoUrl}}/g, this.extraData.logoUrl || '');
    return html;
  }

  async send(templateName, subject) {
    const html = this.loadTemplate(templateName);

    const mailOptions = {
      from: this.from, 
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Clean India Family');
  }

  async sendOnAmountTransfer() {
    await this.send('amountCredit', 'Amount Transfer Successful');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Reset Your Password');
  }
};

export default Email;
