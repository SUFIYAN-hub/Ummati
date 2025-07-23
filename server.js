// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const Bayan = require("./models/Bayan");
// const cron = require("node-cron");
// const runFetchBayans = require("./fetchBayans");

// const app = express();
// const searchRoutes = require('./routes/search');
// app.use('/api/search', searchRoutes);


// // // ✅ Middleware
// app.use(cors());
// app.use(express.json());

// // // ✅ Serve static files
// app.use(express.static("public"));

// // ✅ Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || "your-default-local-uri")
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // ✅ Run cron job daily at 7 AM
// cron.schedule("0 7 * * *", () => {
//   console.log("🕖 Scheduled cron job triggered");
//   runFetchBayans();
// });


// // ✅ Get bayans with pagination support
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
//     res.status(500).json({ error: "Failed to fetch bayans", details: err.message });
//   }
// });

// // ✅ NEW: Get bayans by scholar slug
// app.get("/api/bayans/scholar/:slug", async (req, res) => {
//   const { slug } = req.params;
//   console.log("📛 Scholar Slug requested:", slug);
//   try {
//     const bayans = await Bayan.find({ scholarSlug: slug }).sort({ date: -1 });
//     res.json(bayans);
//   } catch (err) {
//     console.error("❌ Error in /api/bayans/scholar/:slug:", err.message);
//     res.status(500).json({ error: "Failed to fetch scholar bayans", details: err.message });
//   }
// });

// // ✅ Get latest bayan
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
//     res.status(500).json({ error: "Failed to fetch latest bayan", details: err.message });
//   }
// });

// // ✅ Get bayans by category
// app.get("/api/bayans/category/:category", async (req, res) => {
//   const category = req.params.category;
//   try {
//     const bayans = await Bayan.find({ category }).sort({ date: -1 });
//     res.json(bayans);
//   } catch (err) {
//     console.error("❌ Error fetching category bayans:", err.message);
//     res.status(500).json({ error: "Failed to fetch category bayans" });
//   }
// });


// // ✅ Add new bayan manually
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

// // ✅ Search bayans
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
//     res.status(500).json({ error: "Failed to search bayans", details: err.message });
//   }
// });

// // ✅ Test route
// app.get("/api/test", async (req, res) => {
//   try {
//     const count = await Bayan.countDocuments();
//     res.send(`✅ Bayans count: ${count}`);
//   } catch (err) {
//     console.error("❌ Test route error:", err);
//     res.status(500).send("❌ Test failed");
//   }
// });

// // ✅ Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// app.get("/api/suggestions", async (req, res) => {
//   const q = req.query.q;
//   if (!q) return res.json([]);

//   try {
//     const results = await Bayan.find({ title: { $regex: q, $options: "i" } })
//       .limit(5)
//       .select("title scholar video");
//     res.json(results);
//   } catch (err) {
//     console.error("❌ Error in suggestions:", err);
//     res.status(500).json({ error: "Failed to fetch suggestions" });
//   }
// });


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require("node-cron");
const Bayan = require("./models/Bayan");
const runFetchBayans = require("./fetchBayans");

const app = express();

// =====================
// ✅ MIDDLEWARE SETUP
// =====================
app.use(cors()); // must be on top
app.use(express.json());
app.use(express.static("public")); // for serving assets (like images)

// =====================
// ✅ CONNECT TO MONGODB
// =====================
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/your-db-name")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// =====================
// ✅ ROUTES
// =====================

// Search Suggestions (for live search box)
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

// Search Page Route
const searchRoutes = require('./routes/search');
app.use('/api/search', searchRoutes);

// Paginated Bayans (Home + Scholar)
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

// Scholar Bayans (by slug)
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

// Category Bayans
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

// Latest Bayan
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

// Search Bayans manually (title + scholar + optional filter)
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

// Add New Bayan (optional manual use)
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

// Test Route
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
// ✅ CRON JOB (fetch YouTube data daily)
// =====================
cron.schedule("0 7 * * *", () => {
  console.log("🕖 Scheduled cron job triggered");
  runFetchBayans();
});

// =====================
// ✅ START SERVER
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
