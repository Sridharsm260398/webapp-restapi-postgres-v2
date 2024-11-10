const fs = require('fs').promises;
const fsSyc = require('fs');
//const url = require('url');
const cors = require('cors');
//const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
//const mysql = require('mysql')
const pool = require('./database/connection');
const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const userRoute = require('./routes/userRoutes');
const addressRoute = require('./routes/addressRoutes');
const loginRoute = require('./routes/loginRoutes');
const signupRoute = require('./routes/signupRoutes');
const paymentRoute = require('./routes/paymentRoutes');
const productRoute = require('./routes/productRoutes');
const passwordChangeRoute = require('./routes/passwordRoutes');
const invoiceRoute = require('./routes/invoiceRoutes');
const profileRoute = require('./routes/profileRoutes');
const uploadRoute = require('./routes/uploadRoutes'); 
const bcrypt = require('bcryptjs');
const path = require('path');
const { get } = require('https');
const { stat } = require('fs');
const { error } = require('console');
const { STATUS_CODES } = require('http');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const checkAuth =require('./middleware/check.auth')
const dotenv = require('dotenv');
dotenv.config({ path: './src/config.env' })
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(morgon.json());
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../src`));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads'));

const options = {
  explorer: true,
   // customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    authAction: {
      bearerAuth: {
        name: 'bearerAuth',
        schema: {
          type: 'http',
          in: 'header',
          name: 'Authorization',
          description: 'This auth field is filled with the token which is get from the login of the user',
        },
        value: 'Bearer <JWT>',
      },
    },
  },
};
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument,options)
);
app.use((req, res, next) => {
  console.log("Welcom to Sridhar's REST API WebApp S-cart!");
  next();
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization,Scart,Lang,Website,AuthCode,UserId,App-Mode'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});
const uploadDir = path.join(__dirname, 'uploads');
if (!fsSyc.existsSync(uploadDir)) {
  fsSyc.mkdirSync(uploadDir, { recursive: true });
}
/* const pool = mysql.createpool({
  host: 'localhost',
  user: 'root',
  password: 'Shreyas@1998',
  database: 'store'
}); */
app.use((req, res, next) => {
  req.requestedDate = new Date().toISOString();
  console.log(req.requestedDate);
  next();
});

//created the middleware
app.use('/profiles', uploadRoute);
app.use('/api/v1/users', signupRoute);
app.use('/api/v1/users', loginRoute);
app.use('/api/v1/users', paymentRoute);
app.use('/api/v1/users/address', addressRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', passwordChangeRoute);
app.use('/api/v1/users', invoiceRoute);
app.use('/profile', profileRoute);
app.all('*', (req, res, next) => {
  return res.status(404).json({
    error: {
      errMessageList: {
        errorCode: 404,
        status: 'Fail',
        message: `Can't find the ${req.originalUrl} on this server`,
      },
    },
  });
});
// userRoute.route('/creditdebit').post(addCreditDebit).get(getCreditDebit);
// addressRoute.route('/').post(createaddress).get(getALLUserAddress);
// addressRoute.route('/:id').get(getSingleUserAddress).delete(deleteUserAddresswithId);
// addressRoute.route('/:id/:addressid').get(getSingleUserAddresswithAddressID).delete(deleteUserAddresswithAddressID)
// userRoute.route('/profile').post(createProfile);
// userRoute.route('').get(getAllUser);
// userRoute.route('/signup').post(singupUser);
// userRoute.route('/login').post(loginUser);
// userRoute.route('/:id').get(getSingleUser).delete(deleteUser).patch(updateUserProfile)
// app.route('/api/v1/users/creditdebit').post(addCreditDebit).get(getCreditDebit);
// app.route('/api/v1/users/address').post(createaddress).get(getALLUserAddress);
// app.route('/api/v1/users/address/:id').get(getSingleUserAddress).delete(deleteUserAddresswithId);
// app.route('/api/v1/users/address/:id/:addressid').get(getSingleUserAddresswithAddressID).delete(deleteUserAddresswithAddressID)
// app.route('/api/v1/users/profile').post(createProfile);
// app.route('/api/v1/users').get(getAllUser);
// app.route('/api/v1/users/signup').post(singupUser);
// app.route('/api/v1/users/login').post(loginUser);
// app.route('/api/v1/users/:id').get(getSingleUser).delete(deleteUser).patch(updateUserProfile)

// app.get('/api/v1/users', getallTours);
// app.post('/api/v1/users', createTour);
// app.get('/api/v1/users/:id', getTour);
// app.patch('/api/v1/users/:id', updateTour);
// app.delete('/api/v1/users/:id', deleteTour);
module.exports = app;
