const Budget = require('../models/Budget');

exports.createBudget = async (req, res) => {
  const { category, limit, month } = req.body;

  try {
    // Ensure req.user and req.user._id exist
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request' });
    }

    let budget = await Budget.findOne({ userId: req.user.id, category, month });

    if (budget) {
      budget.limit = limit;
      await budget.save();
    } else {
      budget = new Budget({ userId: req.user.id, category, limit, month });
      await budget.save();
    }

    res.status(200).json(budget);
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request' });
    }
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.updateBudget = async (req, res) => {
  const { id } = req.params;
  const { category, limit, month } = req.body;
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { category, limit, month },
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteBudget = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
    const budget = await Budget.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};