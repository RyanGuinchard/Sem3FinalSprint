const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

const userDAL = {
  async createUser(username, password, isAdmin = false) {
    try {
      // Check if the user is an admin
      if (isAdmin) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const query =
          "INSERT INTO users (username, password, isAdmin) VALUES ($1, $2, $3) RETURNING id";
        const values = [username, hashedPassword, isAdmin];
        const result = await pool.query(query, values);

        return result.rows[0].id;
      } else {
        throw new Error(
          "Only administrators are allowed to register new users"
        );
      }
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  },

  async getUserByUsername(username) {
    try {
      const query = "SELECT * FROM users WHERE username = $1";
      const result = await pool.query(query, [username]);
      return result.rows[0];
    } catch (error) {
      throw new Error("Error getting user by username: " + error.message);
    }
  },
};

module.exports = userDAL;
