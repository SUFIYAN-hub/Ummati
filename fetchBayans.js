require("dotenv").config();
const mongoose = require("mongoose");
const { google } = require("googleapis");
const Bayan = require("./models/Bayan");
const scholars = require("./scholars");

const apiKey = process.env.YOUTUBE_API_KEY;
console.log("✅ Using API Key:", apiKey);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Fetch bayans for one scholar
async function fetchBayansForScholar(scholar) {
  const youtube = google.youtube({
    version: "v3",
    auth: apiKey
  });

  try {
    const res = await youtube.search.list({
      part: "snippet",
      channelId: scholar.channelId,
      maxResults: 10,
      order: "date",
      type: "video"
    });

    const bayans = res.data.items.map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      video: `https://www.youtube.com/embed/${item.id.videoId}`,
      date: item.snippet.publishedAt,
      scholar: scholar.name, // ✅ fixed from scholar.key to scholar.name
    }));

    for (const bayan of bayans) {
      if (!bayan.videoId) continue; // ✅ safety check
      const exists = await Bayan.findOne({ videoId: bayan.videoId });
      if (!exists) {
        console.log("📦 Saving bayan:", bayan); // ✅ debug log
        await Bayan.create(bayan);
        console.log(`✅ New bayan saved: ${bayan.title}`);
      }
    }
  } catch (err) {
    console.error(`❌ Error fetching bayans for ${scholar.name}:`, err.message);
  }
}

// ✅ Loop through all scholars
async function runFetchBayans() {
  for (const scholar of scholars) {
    console.log(`🔍 Fetching for ${scholar.name}`);
    await fetchBayansForScholar(scholar);
  }
}

// ✅ Run script
runFetchBayans()
  .then(() => console.log("🎉 Finished fetching bayans"))
  .catch(err => console.error("❌ Error running script:", err));
