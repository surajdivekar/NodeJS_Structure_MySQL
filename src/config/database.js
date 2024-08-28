const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      timezone: "+05:30", // Adjust this to your timezone
    },
    timezone: "+05:30", // Adjust this to your timezone
  }
);

module.exports = sequelize;

// const mysql = require("mysql2/promise");
// // const { createLogger, format, transports } = require("winston");
// require("dotenv").config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// const connectDB = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log("Database connected successfully!");
//     connection.release();
//   } catch (error) {
//     console.error("Error connecting to the database:", error.message);
//     throw error;
//   }
// };

// const query = async (sql, params) => {
//   try {
//     const [results] = await pool.execute(sql, params);
//     // console.log(`Query executed: ${sql}`);
//     return results;
//   } catch (error) {
//     console.error(`Query error: ${sql}`, error);
//     throw error;
//   }
// };

// module.exports = {
//   pool,
//   connectDB,
//   query,
// };
