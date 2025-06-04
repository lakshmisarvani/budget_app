const Expense = require('../models/Expense');

// Create a new expense
exports.createExpense = async (req, res) => {
  const { category, amount, description, date } = req.body;
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request' });
    }
    const expense = new Expense({
      userId: req.user.id,
      category,
      amount,
      description,
      date,
    });
    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all expenses for the logged-in user
exports.getExpenses = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request' });
    }
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an expense by ID
exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { category, amount, description, date } = req.body;
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { category, amount, description, date },
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};