// assignCategories.js
require("dotenv").config();
const mongoose = require("mongoose");
const Bayan = require("./models/Bayan");

const categoryMap = [
  { keyword: /ramzan|ramadan|roza|fast/i, category: "Ramzan" },
  { keyword: /aqidah|sunni|ala hazrat|barelvi|belief/i, category: "Aqidah" },
  { keyword: /prophet|rasool|muhammad|huzur|aqa|aaqa|Husne Mustafa|nabi/i, category: "Love of Prophet ﷺ" },
  { keyword: /namaz|salah|salat|Namazi|Tahajjud|prayer/i, category: "Namaz" },
  { keyword: /death|qabar|afterlife|maut|mout|qabar|grave/i, category: "Death & Afterlife" },
  { keyword: /seerat|sirat|Rasool|hazoor|SEERAT-E-MUSTAFA|Milad-Un-Nabi|Huzur Ki Mohabbat|life of prophet/i, category: "Seerat un Nabi ﷺ" },
  { keyword: /tawheed|Allah/i, category: "Tawheed" },
  { keyword: /history|Karbala|Badr|Uhad|Jung|Hazrat Ali|Hazrat Umar|Sultan Salahuddin Ayyubi|Khalid Bin Walid|Sahaba|Ahle Bait|islamic history/i, category: "Islamic History" },
  { keyword: /youth|Naujawan|Napak|Nojawan|Jawani|young/i, category: "Youth Guidance" },
  { keyword: /women|Aurat|Mard|Napak|Parda|Burqa|Haya|Hazrat Fatima|Hazrat Khadija|Nikah|Hazrat Zainab|Sharm O Haya|Hazrat Ayesha|ladies/i, category: "Women in Islam" },
  { keyword: /unity|Ittehad|Khilafat|Abu Bakar Siddique|Umar E Farooq|Usman E Ghani|Hazrat Ali|muslim unity/i, category: "Unity" },
  { keyword: /zakat|Zakat/i, category: "Zakat" },
  { keyword: /dua|Dua Aor Ibadat|Zikr|supplication/i, category: "Dua" },
  { keyword: /parents|Maa Baap|Beta|Waladen|parenting/i, category: "Parenting" },
  { keyword: /social media|Halal|Haram|internet/i, category: "Social Media" },
];

async function assignCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const bayans = await Bayan.find({});
    let updatedCount = 0;

    for (const bayan of bayans) {
      if (bayan.category) continue; // skip already categorized

      const match = categoryMap.find(entry => entry.keyword.test(bayan.title));
      if (match) {
        bayan.category = match.category;
        await bayan.save();
        updatedCount++;
        console.log(`📝 Updated: ${bayan.title} → ${match.category}`);
      }
    }

    console.log(`✅ Done. Total categorized: ${updatedCount}`);
    process.exit();
  } catch (err) {
    console.error("❌ Error assigning categories:", err);
    process.exit(1);
  }
}

assignCategories();
