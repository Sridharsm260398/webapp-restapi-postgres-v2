const pool = require('../database/connection');
const bcrypt = require('bcryptjs');
exports.getAllUser = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.status(200).json({
      status: 'Success',
      result: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getSingleUser = async (req, res) => {
  const { user_id } = req.query;
  try {
    const userResults = await pool.query('SELECT * FROM users WHERE user_id = $1', [
      user_id,
    ]);
    if (userResults.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    delete userResults.rows[0].password
    delete userResults.rows[0].forget_password
    res.status(200).json({
      status: 'success',
      data: userResults.rows[0],
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { user_id } = req.query;
  const { email, phone_number, password } = req.body;
  try {
    const userResults = await pool.query('SELECT * FROM users WHERE user_id = $1', [
      user_id,
    ]);
    if (userResults.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    if(email==""|| phone_number==""){
      res.status(400).json({
        error: "Email or Phone number can't be null"
      });
    }
    const user = userResults.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    if (email !== user.email || phone_number !== user.phone_number) {
      const results = await pool.query(
        'SELECT * FROM users WHERE (email = $1 OR phone_number = $2) AND user_id != $3',
        [email, phone_number, user_id]
      );
      if (results.rows.length > 0) {
        return res
          .status(400)
          .json({ error: 'Email or phone number already exists' });
      }
      await pool.query(
        'UPDATE users SET email = $1, phone_number = $2 WHERE user_id = $3',
        [email, phone_number, user_id]
      );
      return res.status(201).json({
        status: 'success',
        message: 'User profile updated successfully',
      });
    } else {
      res.status(200).json({
        status: 'success',
        warning: 'No changes detected in email or phone number',
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { user_id } = req.query;
  try {
    await pool.query('DELETE FROM users WHERE user_id = $1', [user_id]);
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createProfile = async (req, res) => {
  const { first_name, last_name, email, phone_number } = req.body;
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
    const values = [first_name, last_name, email, phone_number];
    await pool.query(
      'INSERT INTO users (first_name, last_name, email, phone_number) VALUES($1, $2, $3, $4)',
      values
    );
    res.status(201).json({
      status: 'success',
      message: 'User profile created successfully',
      data: req.body,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
