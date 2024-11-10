const jwt = require("jsonwebtoken");

module.exports.authMiddleware  = async (req, res, next) => {
  try {
    //console.log(req.headers.authorization)
    const token = req.headers.authorization.split(" ")[1];
    console.log(token)
    console.log(process.env.JWT_SECRET_KEY)
    const data = await jwt.verify(token,  process.env.JWT_SECRET_KEY)
    console.log(`'User Id':${data.userID}`)
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};

 const signToken = id => {
  return jwt.sign({  id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_SESSION_EXPIRE
  });
};
 module.exports.createSendToken =  createSendToken =(user, statusCode, req, res) => {
 // console.log(user)
  const token = signToken(user);

  res.cookie('jwt', token, {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};
