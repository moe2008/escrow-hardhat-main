const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");
app.use(cors());

// Middleware zum Parsen des Request-Bodies
app.use(bodyParser.json());

// Speicher für die Escrows
const escrows = [];

// Route zum Speichern einer Escrow
app.post("/api/escrows", (req, res) => {
  const escrow = req.body;
  console.log(escrow);
  escrows.push(escrow);
  res.status(201).json(escrow);
});

// Route zum Abrufen aller Escrows
app.get("/api/escrows", (req, res) => {
  res.json(escrows);
});

// Starte den Server
app.listen(3000, () => {
  console.log("Server gestartet auf Port 3000");
});
