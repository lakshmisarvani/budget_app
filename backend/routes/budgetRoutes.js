const express = require('express');
const auth = require('../middleware/authMiddleware');
const Budget = require('../models/Budget');

const router = express.Router();

// Create or update budget
router.post('/', auth, async (req, res) => {
  const { category, limit, month } = req.body;

  try {
    let budget = await Budget.findOne({ userId: req.user._id, category, month });

    if (budget) {
      budget.limit = limit;
      await budget.save();
    } else {
      budget = new Budget({ userId: req.user._id, category, limit, month });
      await budget.save();
    }

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Error creating/updating budget' });
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'Budget route is working!' });
});

// Get all budgets for user
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching budgets' });
  }
});


module.exports = router;
