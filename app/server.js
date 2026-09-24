const express = require("express");
const { Pool } = require("pg");

const app = express();

const PORT = process.env.PORT || 8081;
const ENVIRONMENT = process.env.ENVIRONMENT || "unknown";
const VERSION = "1.0.0";

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "customerdb",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    environment: ENVIRONMENT,
    version: VERSION
  });
});

// Database connectivity check
app.get("/db-check", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1 AS connected");

    res.status(200).json({
      status: "DB_CONNECTED",
      databaseHost: process.env.DB_HOST,
      result: result.rows[0].connected
    });
  } catch (error) {
    res.status(503).json({
      status: "DB_CONNECTION_FAILED",
      error: error.message
    });
  }
});

// Get all customers from PostgreSQL
app.get("/customers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM customers ORDER BY id"
    );

    res.status(200).json({
      count: result.rows.length,
      customers: result.rows
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve customers",
      message: error.message
    });
  }
});

// Search customers from PostgreSQL
app.get("/customers/search", async (req, res) => {
  try {
    const query = (req.query.q || "").trim();

    if (!query) {
      return res.status(400).json({
        error: "Query parameter 'q' is required"
      });
    }

    const result = await pool.query(
      `SELECT id, name, email
       FROM customers
       WHERE name ILIKE $1
       ORDER BY id`,
      [`%${query}%`]
    );

    res.status(200).json({
      query,
      count: result.rows.length,
      results: result.rows
    });
  } catch (error) {
    res.status(500).json({
      error: "Customer search failed",
      message: error.message
    });
  }
});

// Application home
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Customer App running",
    environment: ENVIRONMENT,
    version: VERSION,
    databaseHost: process.env.DB_HOST
  });
});

app.listen(PORT, () => {
  console.log(
    `Customer app listening on port ${PORT} [env=${ENVIRONMENT}]`
  );
});