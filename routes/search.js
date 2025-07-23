// const express = require('express');
// const router = express.Router();
// const Bayan = require('../models/Bayan');

// router.get('/', async (req, res) => {
//   const query = req.query.q;
//   if (!query) return res.json([]);

//   try {
//     const regex = new RegExp(query, 'i'); // case-insensitive search
//     const results = await Bayan.find({
//       $or: [
//         { title: regex },
//         { scholar: regex },
//         { category: regex }, // only if you added category field
//       ]
//     }).sort({ date: -1 });

//     res.json(results);
//   } catch (err) {
//     res.status(500).json({ error: "Search error: " + err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Bayan = require('../models/Bayan');

router.get('/', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  try {
    const regex = new RegExp(query, 'i');
    const suggestions = await Bayan.find({
      $or: [
        { title: regex },
        { scholar: regex }
      ]
    }).limit(10);

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

module.exports = router;
