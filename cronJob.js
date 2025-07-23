require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const cron = require("node-cron");
const Bayan = require("./models/Bayan");

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)

  .then(() => console.log("✅ MongoDB connected in cronJob.js"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Scholars list (add more as needed)
const scholars = [
  {
    name: "salman-azhari",
    channelId: "UC0IivG_lk0ELbFFj46WFrGw", // Replace with correct channelId
  },
  {
    name: "saquib-shaami",
    channelId: "UCO-Rw8AfnkQO3L7TCBq40Eg",
  },
  {
    name: "ajmal-qadri",
    channelId: "UCxhWp1FeSSx6qbb2f4ohoBg",
  }
];

// ✅ Fetch bayans for one scholar (with pagination)
async function fetchBayansForScholar(scholar) {
  console.log(`🔍 Fetching videos for: ${scholar.name}`);
  const apiKey = process.env.YOUTUBE_API_KEY;

  let nextPageToken = "";
  let totalFetched = 0;
  const maxPages = 5;

  try {
    for (let page = 0; page < maxPages; page++) {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${scholar.channelId}&part=snippet&type=video&order=date&maxResults=50&pageToken=${nextPageToken}`;

      const response = await axios.get(url);
      const videos = response.data.items;

      for (const video of videos) {
        const videoId = video.id.videoId;
        const exists = await Bayan.findOne({ videoId });

        if (!exists) {
          const newBayan = new Bayan({
            title: video.snippet.title,
            videoId,
            scholar: scholar.name,
            date: new Date(video.snippet.publishedAt)
          });

          await newBayan.save();
          console.log(`✅ Saved: ${newBayan.title}`);
          totalFetched++;
        } else {
          console.log(`🔁 Skipped (already exists): ${video.snippet.title}`);
        }
      }

      if (!response.data.nextPageToken) break;
      nextPageToken = response.data.nextPageToken;
    }

    console.log(`🎉 Total new bayans saved for ${scholar.name}: ${totalFetched}`);
  } catch (err) {
    console.error(`❌ Error fetching bayans for ${scholar.name}:`, err.message);
  }
}

// ✅ Main job function
async function runJob() {
  console.log("🕓 Running daily bayan fetch...");
  for (const scholar of scholars) {
    await fetchBayansForScholar(scholar);
  }
  console.log("✅ Finished fetching and saving bayans.");
}

// ✅ Run once immediately
runJob();

// ✅ Schedule to run daily at 6 AM (use "*/5 * * * *" for testing)
cron.schedule("0 6 * * *", runJob);
