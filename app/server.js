const express = require("express");
const { Pool } = require("pg");

const app = express();

const PORT = process.env.PORT || 8081;
const ENVIRONMENT = process.env.ENVIRONMENT || "unknown";
const VERSION = process.env.APP_VERSION || "1.0.0";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "customerdb",
  user: process.env.DB_USER || "appuser",
  password: process.env.DB_PASSWORD || "password"
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    environment: ENVIRONMENT,
    version: VERSION
  });
});

app.get("/db-check", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "UP",
      database: "CONNECTED",
      environment: ENVIRONMENT,
      version: VERSION
    });
  } catch (error) {
    res.status(500).json({
      status: "DOWN",
      database: "NOT_CONNECTED",
      error: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Customer App running",
    environment: ENVIRONMENT,
    version: VERSION
  });
});

app.listen(PORT, () => {
  console.log(`Customer app listening on port ${PORT} [env=${ENVIRONMENT}]`);
});