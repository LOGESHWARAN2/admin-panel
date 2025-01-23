import mysql from 'mysql2/promise';
import fs from 'fs';

// Database connection configuration
const config = {
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
};

async function initializeDatabase() {
  try {
    // Create a connection to the database server
    const connection = await mysql.createConnection(config);

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS adminpanel');
    console.log('Database created or already exists.');

    // Connect to the `adminpanel` database
    await connection.changeUser({ database: 'adminpanel' });

    // Create `users` table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createUsersTable);
    console.log('Users table created or already exists.');

    // Create `pricingplan` table
    // const createPricingPlanTable = `
    //   CREATE TABLE IF NOT EXISTS pricingplan (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     name VARCHAR(255) NOT NULL,
    //     price DECIMAL(10, 2) NOT NULL,
    //     description TEXT,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   );
    // `;
    // await connection.query(createPricingPlanTable);
    // console.log('PricingPlan table created or already exists.');

    // // Create `pagecontent` table
    const data = fs.readFileSync('./json/pageContent.json', 'utf-8'); // Read file as a string
    const pagecontent = JSON.parse(data); // Parse the string into a JSON object
    const createPageContentTable = `
      CREATE TABLE IF NOT EXISTS pagecontent (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plan_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        resources TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createPageContentTable);
    console.log('PageContent table created or already exists.');
    let table = 'pagecontent';
    const insertQuery = `INSERT INTO ${table} (plan_id, title, content, images) VALUES ?`;

    const keys = Object.keys(pagecontent);
    console.log('kes => ', pagecontent["user-testing"]);
    const values = keys.map((key) => {
      const {title, content, images, videos} = pagecontent[key];
      let resources = [];
      if(images && images.length) {
        resources = images;
      }
      if(videos && videos .length) {
        resources = videos ;
      }

      console.warn(pagecontent[key]);
      // console.log('title => ',title);
      // console.log('content => ',content);
      // console.log('images => ',resources);
      return [title, content, resources.join('')];
    });
    connection.query(insertQuery, [values], (err, result) => {
      if (err) throw err;
      console.log(`Inserted ${result.affectedRows} rows into '${table}'.`);
      connection.end(); // Close the connection
      console.log('Connection closed.');
    });
    // Close the connection
    // await connection.end();
  } catch (err) {
    console.error('Error initializing the database:', err.message);
  }
}

// Run the database initialization
initializeDatabase();