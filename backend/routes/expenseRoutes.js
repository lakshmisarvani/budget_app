const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Add expense
router.post('/', auth, async (req, res) => {
  const { amount, category, description, date } = req.body;

  try {
    const expense = new Expense({
      userId: req.user._id,
      amount,
      category,
      description,
      date
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Error adding expense' });
  }
});

// Get expenses by month
router.get('/', auth, async (req, res) => {
  const { month } = req.query;

  try {
    let matchQuery = { userId: req.user._id };
    if (month) {
      const [year, m] = month.split('-');
      const start = new Date(`${year}-${m}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      matchQuery.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(matchQuery).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

module.exports = router;
