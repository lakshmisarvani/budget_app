const express = require('express');
const auth = require('../middleware/authMiddleware');
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');

const router = express.Router();

router.post('/create', auth, createExpense);
router.get('/', auth, getExpenses);
router.get('/test', (req, res) => res.json({ message: 'Expense route is working!' }));

router.put('/:id', auth, updateExpense);      // Update expense by ID
router.delete('/:id', auth, deleteExpense);   // Delete expense by ID

module.exports = router;

// // const express = require('express');
// // const Expense = require('../models/Expense');
// // const auth = require('../middleware/authMiddleware');

// // const router = express.Router();

// // // Add expense
// // router.post('/', auth, async (req, res) => {
// //   const { amount, category, description, date } = req.body;

// //   try {
// //     const expense = new Expense({
// //       userId: req.user._id,
// //       amount,
// //       category,
// //       description,
// //       date
// //     });
// //     await expense.save();
// //     res.status(201).json(expense);
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error adding expense' });
// //   }
// // });

// // // Get expenses by month
// // router.get('/', auth, async (req, res) => {
// //   const { month } = req.query;

// //   try {
// //     let matchQuery = { userId: req.user._id };
// //     if (month) {
// //       const [year, m] = month.split('-');
// //       const start = new Date(`${year}-${m}-01`);
// //       const end = new Date(start);
// //       end.setMonth(end.getMonth() + 1);

// //       matchQuery.date = { $gte: start, $lt: end };
// //     }

// //     const expenses = await Expense.find(matchQuery).sort({ date: -1 });
// //     res.json(expenses);
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error fetching expenses' });
// //   }
// // });

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const Expense = require("../models/Expense");
// const jwt = require("jsonwebtoken");

// // // JWT middleware to verify token and extract user id
// // function authMiddleware(req, res, next) {
// //   const authHeader = req.headers.authorization || "";
// //   const token = authHeader.replace(/^Bearer\s*/, "");
// //   if (!token) {
// //     return res.status(401).json({ message: "No token provided" });
// //   }
// //   try {
// //     // Replace 'your_jwt_secret' with your actual secret key!
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
// //     req.user = { id: decoded.id };
// //     next();
// //   } catch (err) {
// //     return res.status(401).json({ message: "Invalid or expired token" });
// //   }
// // }
// const authMiddleware=require("../middleware/authMiddleware");
// router.use(authMiddleware);

// // GET all expenses for the logged-in user
// router.get("/", async (req, res) => {
//   try {
//     const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
//     res.json(expenses);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // CREATE expense
// router.post("/create", async (req, res) => {
//   try {
//     const { category, amount, date } = req.body;
//     const expense = new Expense({
//       category,
//       amount,
//       date,
//       user: req.user.id
//     });
//     await expense.save();
//     res.json(expense);
//   } catch (err) {
//     res.status(400).json({ message: "Could not create expense" });
//   }
// });

// // UPDATE expense
// router.put("/:id", async (req, res) => {
//   try {
//     const { category, amount, date } = req.body;
//     const expense = await Expense.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       { category, amount, date },
//       { new: true }
//     );
//     if (!expense) return res.status(404).json({ message: "Expense not found" });
//     res.json(expense);
//   } catch (err) {
//     res.status(400).json({ message: "Could not update expense" });
//   }
// });

// // DELETE expense
// router.delete("/:id", async (req, res) => {
//   try {
//     const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
//     if (!expense) return res.status(404).json({ message: "Expense not found" });
//     res.json({ message: "Deleted" });
//   } catch (err) {
//     res.status(400).json({ message: "Could not delete expense" });
//   }
// });

// module.exports = router;