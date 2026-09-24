const express = require("express");
const app = express();
const PORT = process.env.PORT || 8081;
const ENVIRONMENT = process.env.ENVIRONMENT || "unknown";
const VERSION = "1.0.0";

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", environment: ENVIRONMENT, version: VERSION });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Customer App running", environment: ENVIRONMENT, version: VERSION });
});

app.listen(PORT, () => {
  console.log(`Customer app listening on port ${PORT} [env=${ENVIRONMENT}]`);
});