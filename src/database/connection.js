const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: './src/config.env' })
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'postgres',
//     port: 5432, 
//    });
/*    const pool = new Pool({
    user: 'default',
    host: process.env.DB_HOST,
    database: process.env.DB,
    password: process.env.DB_PWD,
    port: 5432,   
    ssl: {
      rejectUnauthorized: false,
    },
   }); */
 //  console.log(process.env.POSTGRES_URL)
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })

   pool.connect()
   .then(() => {
     console.log('DB Connection to postgres has been established successfully!!');
   //  console.log(pool.options.user,pool.options.host,pool.options.database,pool.options.port);
   })
   .catch(err => {
     console.error('Unable to connect to the database:', err);
   });
   module.exports =pool
