// const mongoose = require("mongoose");

// const bayanSchema = new mongoose.Schema({
//   title: String,
//   videoId: String,
//   scholar: String,
//   date: Date
// });

// module.exports = mongoose.model("Bayan", bayanSchema);

const mongoose = require("mongoose");

const bayanSchema = new mongoose.Schema({
  title: String,
  videoId: String,
  video: String,
  date: Date,
  scholar: String,
  scholarSlug: String,
  category: String // ✅ new field
});

module.exports = mongoose.model("Bayan", bayanSchema);
