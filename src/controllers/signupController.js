const pool = require('../database/connection');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const sgMail = require('@sendgrid/mail');
const Email = require('./../utils/email');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { createSendToken } = require('../middleware/check.auth');
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:process.env.MAIL_API_KEY   ,
    },
  })
);
// sgMail.setApiKey(process.env.MAIL_API_KEY   );
// const msg = {
//   to: 'wertyu@gmail.com',
//   from: 'wertyui@gmail.com', // Use the email address or domain you verified above
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
exports.signupUser = async (req, res) => {
  const {
    email,
    password,
    forget_password,
    phone_number,
    first_name,
    last_name,
  } = req.body;
  try {
    const emailResults = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (emailResults.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const numberResults = await pool.query(
      'SELECT * FROM users WHERE phone_number = $1',
      [phone_number]
    );
    if (numberResults.rows.length > 0) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }
    const hashPwd = await bcrypt.hash(password, 12);
    const userID = uuidv4();
    const token = jwt.sign({ user_id: userID }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_SESSION_EXPIRE,
    });
    const values = [
      email,
      hashPwd,
     password,
     // forget_password,
      phone_number,
      first_name,
      last_name,
      userID
    ];
    const result = await pool.query(
      'INSERT INTO users (email, password, forget_password, phone_number, first_name, last_name,user_id) VALUES($1, $2, $3, $4, $5, $6,$7)',
      values
    );
/*    req.body.password = hashPwd;
     res.status(200).json({
      SECRET_KEY: token,
      status: 'success',
      message: 'User created successfully',
      data: req.body,
    }); */
    (async () => {
      try {
        const url = `${req.protocol}://${req.get('host')}/profiles/uploads`;
        await new Email(req.body, url).sendWelcome();
        createSendToken( userID , 201, req, res);
        console.log(userID)
        console.log(email);
        //  await transporter.sendMail({
        //   to: email,
        //   from: "wdefrgthyjui@gmail.com",
        //   subject: "New User Created",
        //   html: `<h1> New User Created</h1>`
        // });
      } catch (error) {
        console.error(error);
        if (error.response) {
          console.error(error.response.body)
        }
      }
    })();
  } catch (error) {
    console.error('Error processing signup:', error);
   return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};
