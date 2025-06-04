const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt=require('jsonwebtoken');

const { register, login,  forgotPassword, resetPassword, googleAuth, googleCallback , logout} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Normal auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

// Google OAuth
router.get('/google', googleAuth); // this will redirect to Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false}), googleCallback);
// // ...
// router.get('/me', (req, res) => {
//   if (req.user) {
//     // Only send safe user data
//     return res.json({
//       id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//       role: req.user.role
//     });
//   } else {
//     res.status(401).json({ message: 'Not authenticated' });
//   }
// });

router.get('/me', authMiddleware, (req, res) => {
  if (req.user) {
    // Only send safe user data
    return res.json({
      id: req.user.id,          // use 'id' if that's what's in your JWT payload
      name: req.cookies.userName,  // fallback from cookie if needed
      email: req.cookies.userEmail,
      role: 'user', // or pull from DB if needed
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});



passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Create your JWT token
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    // Set token in cookie
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: 'lax',
      path: '/',
      maxAge: 3600000 // 1 hour
    });
    // Redirect to frontend dashboard
    res.redirect('http://localhost:5173/dashboard');
  }

module.exports = router;