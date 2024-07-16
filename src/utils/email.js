const nodemailer = require('nodemailer');
const pug = require('pug');
const {convert} = require('html-to-text');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const sgMail = require('@sendgrid/mail');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.first_name;
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

// sgMail.setApiKey('');

  newTransport() {
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport(
        sendgridTransport({
          auth: {
            api_key:process.env.MAIL_API_KEY    
          },
        })
      );
    }
  }
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html)
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    console.log(process.env.EMAIL_FROM)
    await this.send('welcome', 'Welcome to the S-cart Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
