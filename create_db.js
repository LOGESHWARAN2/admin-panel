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
    const createPricingPlanTable = `
      CREATE TABLE IF NOT EXISTS pricingplan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plan_id INT NOT NULL,
        pricing_plan_id INT NOT NULL,
        plan_name VARCHAR(255) NOT NULL,
        basic VARCHAR(255) NULL,
        standard VARCHAR(255) NULL,
        premium VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createPricingPlanTable);
    console.log('PricingPlan table created or already exists.');

    // // Create `pagecontent` table
    const data = fs.readFileSync('./json/pageContent.json', 'utf-8'); // Read file as a string
    let pagecontent = JSON.parse(data); // Parse the string into a JSON object
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
    let insertQuery = `INSERT INTO ${table} (plan_id, title, content, resources) VALUES (?, ?, ?, ?)`;
    
    pagecontent = Object.values(pagecontent);
    
    insertData(connection, table, insertQuery, pagecontent);
    
  } catch (err) {
    console.error('Error initializing the database:', err.message);
  }
}

// Run the database initialization
initializeDatabase();
async function insertData(connection, table, insertQuery, data) {
  try {
    data.forEach(async (value, index) => {
      const { title, content, images, videos } = value;
      let resources = [];

      // Handle images and videos
      if (images && images.length) {
        resources = images;
      }
      if (videos && videos.length) {
        resources = videos;
      }

      // Prepare the data for insertion
      const modified = [index + 1, title, content, resources.join(',')];

      // Perform the query
      await new Promise((resolve, reject) => {
        connection.query(insertQuery, modified, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          console.log(`Inserted ${result.affectedRows} rows into '${table}'.`);
          resolve();
        });
      });
    });

    // Close the connection after all queries are done
    connection.end();
    console.log('Connection closed.');
  } catch (err) {
    console.error('Error inserting data:', err);
    connection.end();
  }
}