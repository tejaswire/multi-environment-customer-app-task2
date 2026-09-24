const express = require("express");
const app = express();
const PORT = process.env.PORT || 8081;
const ENVIRONMENT = process.env.ENVIRONMENT || "unknown";
const VERSION = "1.0.0";

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", environment: ENVIRONMENT, version: VERSION });
});

app.get("/customers/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase();
  const customers = [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Smith" },
    { id: 3, name: "Charlie Lee" }
  ];
  const results = customers.filter(c => c.name.toLowerCase().includes(query));
  res.status(200).json({ query, results });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Customer App running", environment: ENVIRONMENT, version: VERSION });
});

app.listen(PORT, () => {
  console.log(`Customer app listening on port ${PORT} [env=${ENVIRONMENT}]`);
});