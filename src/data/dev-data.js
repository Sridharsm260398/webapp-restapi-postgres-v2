const dotenv = require('dotenv');
const pool = require('../database/connection');
const fs = require('fs').promises;
const fsSync = require('fs');
dotenv.config({ path: './config.env' });

/* app.get('/fetch-products', async (req, res) => {
  try {
    const checkQuery = 'SELECT COUNT(*) AS count FROM products';
    pool.query(checkQuery, async (err, results) => {
      if (err) {
        console.error('Error checking products:', err);
        res.status(500).send('Error checking products in database');
        return;
      }
      const productCount = results.rows[0].count;
      if (productCount > 0) {
        res.status(200).send('Products already exist in the database');
        return;
      }
      const response = await fs.readFile(
        `${__dirname}/data/data.json`,
        'utf-8'
      );
      const products = JSON.parse(response);

      const values= products.map((p) => [
        p.id,
        p.title,
        p.price,
        p.description,
        p.category,
        p.image,
        p.rating.rate,
        p.rating.count,
      ]);
      const insertQuery = ` `;
      for (const value of values) {
        pool.query(
          'INSERT INTO products (id, title, price, description, category, image, rate, count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ',
          value,
          (err, result) => {
            if (err) {
              console.error('Error inserting products:', err);
              res.status(500).send('Error fetching and saving products');
              return;
            }
            res.status(200).send('Products fetched and saved to database');
          }
        );
      }
   
    });
  } catch (error) {
    res.status(500).send('Error fetching products from API');
  }
}); */
const fetch_products = async () => {
  try {
    const checkQuery = 'SELECT COUNT(*) AS count FROM products';
    const { rows } = await pool.query(checkQuery);
    const productCount = rows[0].count;
    console.log(productCount);
    if (productCount > 0) {
      console.log('Products already exist in the database');
      return;
    }
    const response = await fs.readFile(`${__dirname}/data.json`, 'utf-8');
    const products = JSON.parse(response);
    const values = products.map((p) => [
      p.id,
      p.title,
      p.price,
      p.description,
      p.category,
      p.image,
      p.rating.rate,
      p.rating.count,
    ]);

    for (const value of values) {
      await pool.query(
        'INSERT INTO products (id, title, price, description, category, image, rate, count) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)',
        value
      );
    }
    console.log('Products fetched and saved to database');
  } catch (error) {
    console.error('Error fetching products:', error.message);
    console.error('Stack trace:', error.stack);
    console.log(`Error fetching products: ${error.message}`);
  }
};
const fetch_products_1 = async () => {
  try {
    // const tours = JSON.parse(fsSync.readFileSync(`${__dirname}/newJson.json`, 'utf-8'));
    // console.log(tours)
    const checkQuery = 'SELECT COUNT(*) AS count FROM products_1';
    const { rows } = await pool.query(checkQuery);
    const productCount = rows[0].count;
    console.log(productCount);
    if (productCount > 0) {
      console.log('Products already exist in the database');
      return;
    }
    const response = await fs.readFile(`${__dirname}/newJson.json`, 'utf-8');
    const products = JSON.parse(response);
    const values = products.map((p) => [
      p.id,
      p.title,
      p.description,
      p.price,
      p.discountPercentage,
      p.rating,
      p.stock,
      p.brand,
      p.category,
      p.thumbnail,
      p.image,
    ]);
    for (const value of values) {
      await pool.query(
        'INSERT INTO products_1(id,title,description,price,discount_percentage,rating,stock,brand,category,thumbnail,image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11)',
        value
      );
    }
    console.log('Products fetched and saved to database');
  } catch (error) {
    console.error('Error fetching products:', error.message);
    console.error('Stack trace:', error.stack);
    console.log(`Error fetching products: ${error.message}`);
  }
};
const importData = async () => {
  try {
    const value = process.argv[3];
    switch (value) {
      case '--products':
        await fetch_products();
        break;
      case '--products_1':
        await fetch_products_1();
        break;
      default:
        console.log('Not a Valid Argument!!');
        return;
    }
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    const value = process.argv[3];
    switch (value) {
      case '--users':
        await pool.query('delete from users');
        break;
      case '--products':
        await pool.query('delete from products');
        break;
      case '--products_1':
        await pool.query('delete from products_1');
        break;
      case '--useraddress':
        await pool.query('delete from useraddress');
        break;
      case '--savedcards':
        await pool.query('delete from savedcards');
        break;
      case '--orders':
        await pool.query('delete from orders');
        break;
      case '--order_items':
        await pool.query('delete from order_items');
        break;
      default:
        console.log('Not a Valid Argument!!');
        return;
    }
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//console.log(process.argv[1])
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}
