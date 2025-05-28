const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

// >>> CAREFULLY RE-TYPE THIS LINE <<<
const budgetRoutes = require('./routes/budgetRoutes');
console.log('budgetRoutes object:', budgetRoutes);

const expenseRoutes = require('./routes/expenseRoutes');
const authMiddleware = require('./middleware/authMiddleware');

app.use(express.json());
app.use(cors());

app.use('/', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

console.log('Attempting to mount budgetRoutes...'); // Added for debugging flow
// >>> CAREFULLY RE-TYPE THIS LINE <<<
app.use('/api/budgets',budgetRoutes);
console.log('budgetRoutes mounted successfully!'); // Added for debugging flow

app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));