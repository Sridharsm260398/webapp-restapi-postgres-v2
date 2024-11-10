const pool = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Email = require('./../utils/email');
const { createSendToken } = require('../middleware/check.auth');
exports.loginUser = async (req, res) => {
  const { email, password,phone_number } = req.body;
  console.log(req.body)
  try {
    const results = await pool.query('SELECT * FROM users WHERE email = $1 and phone_number = $2',  [
      email,phone_number
    ]);
    if (results.rows.length === 0) {
      console.log('Invalid email or password:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }
   const user = results.rows[0];
     const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      console.log('Invalid email or password:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    console.log('User logged in successfully:', email);
    //signToken(user.userID)
    const token = jwt.sign({ userID: user.user_id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_SESSION_EXPIRE,
    });
    res.status(200).json({
      token: token,
      expiresIn:3600,
      status: 'success',
      message: 'User logged in successfully',
      data: { id: user.user_id },
    });
    (async () => {
      try {
        const url = `${req.protocol}://${req.get('host')}/profiles/uploads`;
        await new Email(req.body, url).sendLogin();
      //  createSendToken({ user: userID }, 201, req, res);
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
    console.error('Error checking user credentials:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};