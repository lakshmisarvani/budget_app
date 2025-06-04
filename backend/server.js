// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const session = require('express-session');
// dotenv.config();
// const passport = require('./oauth/passport');
// const app = express();
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
// const healthRoutes = require('./routes/healthRoutes');
// const authRoutes = require('./routes/authRoutes');
// const protectedRoutes = require('./routes/protectedRoutes');

// // >>> CAREFULLY RE-TYPE THIS LINE <<<
// const budgetRoutes = require('./routes/budgetRoutes');
// console.log('budgetRoutes object:', budgetRoutes);

// const expenseRoutes = require('./routes/expenseRoutes');
// const authMiddleware = require('./middleware/authMiddleware');

// app.use(express.json());
// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true
// }));

// app.use(session({
//   secret: 'your-secret',
//   resave: false,
//   saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.use('/', healthRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/protected', protectedRoutes);

// console.log('Attempting to mount budgetRoutes...'); // Added for debugging flow
// // >>> CAREFULLY RE-TYPE THIS LINE <<<
// app.use('/api/budgets',budgetRoutes);
// console.log('budgetRoutes mounted successfully!'); // Added for debugging flow

// app.use('/api/expenses', expenseRoutes);

// const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI, {})
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => console.error('MongoDB connection error:', err));

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
dotenv.config();
const passport = require('./oauth/passport');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cookieParser());
app.use(express.json());

// Make sure CLIENT_URL is set to your frontend URL in .env, e.g., http://localhost:5173
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Robust CORS for cookies and local dev
// app.use(cors({
//   origin: CLIENT_URL,
//   credentials: true
// }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session setup, use secure: false for local dev, true for production with HTTPS
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false, // false is safer for production
  cookie: {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use('/', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

console.log('Attempting to mount budgetRoutes...');
app.use('/api/budgets', authMiddleware, budgetRoutes); // Protect budgets with auth
console.log('budgetRoutes mounted successfully!');

app.use('/api/expenses', authMiddleware, expenseRoutes); // Protect expenses with auth

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));