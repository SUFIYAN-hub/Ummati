const express = require("express");
const router = express.Router();
const Bayan = require("../models/Bayan");

// GET all bayans
router.get("/", async (req, res) => {
  const bayans = await Bayan.find();
  res.json(bayans);
});

// POST a new bayan
router.post("/", async (req, res) => {
  const { scholar, title, video, date } = req.body;
  const newBayan = new Bayan({ scholar, title, video, date });
  await newBayan.save();
  res.json({ message: "Bayan added successfully" });
});

