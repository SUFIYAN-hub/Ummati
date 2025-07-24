// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const cron = require("node-cron");
// const Bayan = require("./models/Bayan");
// const runFetchBayans = require("./fetchBayans");
// const path = require("path");

// const app = express();

// // =====================
// // ✅ MIDDLEWARE SETUP
// // =====================
// app.use(cors()); // must be on top
// app.use(express.json());
// app.use(express.static("public")); // for serving assets (like images)

// // =====================
// // ✅ CONNECT TO MONGODB
// // =====================
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/your-db-name")
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // =====================
// // ✅ ROUTES
// // =====================
// const searchRoutes = require("./routes/search");
// app.use("/api/search", searchRoutes);

// // Suggestions route
// app.get("/api/suggestions", async (req, res) => {
//   const q = req.query.q;
//   if (!q) return res.json([]);
//   try {
//     const results = await Bayan.find({ title: { $regex: q, $options: "i" } })
//       .limit(5)
//       .select("title scholar video");
//     res.json(results);
//   } catch (err) {
//     console.error("❌ Error in /api/suggestions:", err.message);
//     res.status(500).json({ error: "Failed to fetch suggestions" });
//   }
// });

// // Paginated bayans
// app.get("/api/bayans", async (req, res) => {
//   const { scholar, page = 1, limit = 4 } = req.query;
//   const filter = scholar ? { scholar } : {};
//   const skip = (page - 1) * limit;
//   try {
//     const total = await Bayan.countDocuments(filter);
//     const bayans = await Bayan.find(filter)
//       .sort({ date: -1 })
//       .skip(parseInt(skip))
//       .limit(parseInt(limit));
//     res.json({
//       total,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       totalPages: Math.ceil(total / limit),
//       bayans,
//     });
//   } catch (err) {
//     console.error("❌ Error in /api/bayans:", err.message);
//     res.status(500).json({ error: "Failed to fetch bayans" });
//   }
// });

// // Scholar bayans
// app.get("/api/bayans/scholar/:slug", async (req, res) => {
//   const { slug } = req.params;
//   try {
//     const bayans = await Bayan.find({ scholarSlug: slug }).sort({ date: -1 });
//     res.json(bayans);
//   } catch (err) {
//     console.error("❌ Error in /api/bayans/scholar/:slug:", err.message);
//     res.status(500).json({ error: "Failed to fetch scholar bayans" });
//   }
// });

// // Category bayans
// app.get("/api/bayans/category/:category", async (req, res) => {
//   const category = req.params.category;
//   try {
//     const bayans = await Bayan.find({ category }).sort({ date: -1 });
//     res.json(bayans);
//   } catch (err) {
//     console.error("❌ Error in /api/bayans/category:", err.message);
//     res.status(500).json({ error: "Failed to fetch category bayans" });
//   }
// });

// // Latest bayan
// app.get("/api/latest-bayan", async (req, res) => {
//   try {
//     const latestBayan = await Bayan.findOne().sort({ date: -1 });
//     if (latestBayan) {
//       res.json(latestBayan);
//     } else {
//       res.status(404).json({ message: "No bayan found" });
//     }
//   } catch (err) {
//     console.error("❌ Error in /api/latest-bayan:", err.message);
//     res.status(500).json({ error: "Failed to fetch latest bayan" });
//   }
// });

// // Search bayans manually
// app.get("/api/search-bayans", async (req, res) => {
//   const { query, scholar } = req.query;
//   const filter = {};
//   if (scholar) filter.scholar = scholar;
//   if (query) filter.title = { $regex: query, $options: "i" };

//   try {
//     const bayans = await Bayan.find(filter).sort({ date: -1 });
//     res.json(bayans);
//   } catch (err) {
//     console.error("❌ Error in /api/search-bayans:", err.message);
//     res.status(500).json({ error: "Failed to search bayans" });
//   }
// });

// // Manual bayan upload
// app.post("/api/bayans", async (req, res) => {
//   try {
//     const newBayan = new Bayan(req.body);
//     await newBayan.save();
//     res.json({ message: "✅ Bayan added successfully" });
//   } catch (err) {
//     console.error("❌ Error in POST /api/bayans:", err.message);
//     res.status(500).json({ error: "Failed to add bayan" });
//   }
// });

// // Test route
// app.get("/api/test", async (req, res) => {
//   try {
//     const count = await Bayan.countDocuments();
//     res.send(`✅ Bayans count: ${count}`);
//   } catch (err) {
//     console.error("❌ Test route error:", err);
//     res.status(500).send("❌ Test failed");
//   }
// });

// // =====================
// // ✅ CRON JOB
// // =====================
// cron.schedule("0 7 * * *", () => {
//   console.log("🕖 Scheduled cron job triggered");
//   runFetchBayans();
// });

// // =====================
// // ✅ FIXED ROOT ROUTE
// // =====================
// app.get("/", (req, res) => {
//   res.send("🕌 Ummati backend is live and running!");
// });

// // =====================
// // ✅ START SERVER
// // =====================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require("node-cron");
const Bayan = require("./models/Bayan");
const runFetchBayans = require("./fetchBayans");
const path = require("path");

const app = express();

// =====================
// ✅ MIDDLEWARE SETUP
// =====================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // ✅ Serve static files including index.html

// =====================
// ✅ CONNECT TO MONGODB
// =====================
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/your-db-name")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// =====================
// ✅ ROUTES
// =====================
const searchRoutes = require("./routes/search");
app.use("/api/search", searchRoutes);

app.get("/api/suggestions", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);
  try {
    const results = await Bayan.find({ title: { $regex: q, $options: "i" } })
      .limit(5)
      .select("title scholar video");
    res.json(results);
  } catch (err) {
    console.error("❌ Error in /api/suggestions:", err.message);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

app.get("/api/bayans", async (req, res) => {
  const { scholar, page = 1, limit = 4 } = req.query;
  const filter = scholar ? { scholar } : {};
  const skip = (page - 1) * limit;
  try {
    const total = await Bayan.countDocuments(filter);
    const bayans = await Bayan.find(filter)
      .sort({ date: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      bayans,
    });
  } catch (err) {
    console.error("❌ Error in /api/bayans:", err.message);
    res.status(500).json({ error: "Failed to fetch bayans" });
  }
});

app.get("/api/bayans/scholar/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const bayans = await Bayan.find({ scholarSlug: slug }).sort({ date: -1 });
    res.json(bayans);
  } catch (err) {
    console.error("❌ Error in /api/bayans/scholar/:slug:", err.message);
    res.status(500).json({ error: "Failed to fetch scholar bayans" });
  }
});

app.get("/api/bayans/category/:category", async (req, res) => {
  const category = req.params.category;
  try {
    const bayans = await Bayan.find({ category }).sort({ date: -1 });
    res.json(bayans);
  } catch (err) {
    console.error("❌ Error in /api/bayans/category:", err.message);
    res.status(500).json({ error: "Failed to fetch category bayans" });
  }
});

app.get("/api/latest-bayan", async (req, res) => {
  try {
    const latestBayan = await Bayan.findOne().sort({ date: -1 });
    if (latestBayan) {
      res.json(latestBayan);
    } else {
      res.status(404).json({ message: "No bayan found" });
    }
  } catch (err) {
    console.error("❌ Error in /api/latest-bayan:", err.message);
    res.status(500).json({ error: "Failed to fetch latest bayan" });
  }
});

app.get("/api/search-bayans", async (req, res) => {
  const { query, scholar } = req.query;
  const filter = {};
  if (scholar) filter.scholar = scholar;
  if (query) filter.title = { $regex: query, $options: "i" };

  try {
    const bayans = await Bayan.find(filter).sort({ date: -1 });
    res.json(bayans);
  } catch (err) {
    console.error("❌ Error in /api/search-bayans:", err.message);
    res.status(500).json({ error: "Failed to search bayans" });
  }
});

app.post("/api/bayans", async (req, res) => {
  try {
    const newBayan = new Bayan(req.body);
    await newBayan.save();
    res.json({ message: "✅ Bayan added successfully" });
  } catch (err) {
    console.error("❌ Error in POST /api/bayans:", err.message);
    res.status(500).json({ error: "Failed to add bayan" });
  }
});

app.get("/api/test", async (req, res) => {
  try {
    const count = await Bayan.countDocuments();
    res.send(`✅ Bayans count: ${count}`);
  } catch (err) {
    console.error("❌ Test route error:", err);
    res.status(500).send("❌ Test failed");
  }
});

// =====================
// ✅ CRON JOB
// =====================
cron.schedule("0 7 * * *", () => {
  console.log("🕖 Scheduled cron job triggered");
  runFetchBayans();
});

// =====================
// ✅ CATCH-ALL: SERVE FRONTEND INDEX.HTML
// =====================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // ✅ This serves the frontend
});

// =====================
// ✅ START SERVER
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
