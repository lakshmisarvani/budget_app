const express = require('express');
const auth = require('../middleware/authMiddleware');
const { createBudget, getBudgets, updateBudget, deleteBudget } = require('../controllers/budgetController');

const router = express.Router();

router.post('/create', auth, createBudget);
router.get('/', auth, getBudgets);
router.get('/test', (req, res) => res.json({ message: 'Budget route is working!' }));

router.put('/:id', auth, updateBudget);      // Update budget by ID
router.delete('/:id', auth, deleteBudget);   // Delete budget by ID


module.exports = router;
