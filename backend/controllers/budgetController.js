// controllers/budgetController.js
const Budget = require('../models/Budget');

exports.createBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    const budget = new Budget({
      userId: req.user.id, // assuming auth middleware sets req.user
      category,
      limit,
      month,
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
