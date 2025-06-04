// const { generateCodeVerifier, generateState } = require("arctic");
// const { OAUTH_EXCHANGE_EXPIRY } = require("../config/contestants");
// const { google } = require("../oauth/google");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const OauthAccount = require('../models/OauthAccounts');
const passport = require('passport');


// exports.register = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await user.save();

//     // Generate token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });
// console.log("token: " + token);
//     res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set cookies
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });
    res.cookie('userId', user._id.toString(), { sameSite: 'lax' });
    res.cookie('userName', user.name, { sameSite: 'lax' });
    res.cookie('userEmail', user.email, { sameSite: 'lax' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.logout = (req, res) => {
  // Clear all auth-related cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('userId');
  res.clearCookie('userName');
  res.clearCookie('userEmail');
  
  // Optionally clear session if you're using it
  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.status(200).json({
//       message: 'Login successful',
//       accessToken,
//       refreshToken,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Set non-HTTP-only cookies for user info if needed
    res.cookie('userId', user._id.toString(), { sameSite: 'lax' });
    res.cookie('userName', user.name, { sameSite: 'lax' });
    res.cookie('userEmail', user.email, { sameSite: 'lax' });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail(user.email, 'Your OTP Code', `Your OTP is ${otp}`);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.resetOTP !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// These handlers are just for reference, passport will handle the OAuth flow
exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = (req, res) => {
  if (req.user) {
    const jwt = require('jsonwebtoken');
    const accessToken = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set true in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // You can also set user info as a cookie (not httpOnly) if you want
    res.cookie('userId', req.user._id.toString(), { sameSite: 'lax' });
    res.cookie('userName', req.user.name, { sameSite: 'lax' });
    res.cookie('userEmail', req.user.email, { sameSite: 'lax' });

    // Redirect to dashboard (or wherever you want)
   // return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
   return res.redirect(`${process.env.CLIENT_URL}/google-auth-success`);
   
  } else {
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};

// exports.googleCallback = (req, res) => {
//   // Successful login, redirect to frontend dashboard with tokens in query (or set cookie)
//   if (req.user) {
//     // You can generate tokens as in your login function and send to frontend
//     const jwt = require('jsonwebtoken');
//     const accessToken = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     const refreshToken = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//     // Send to frontend
//     const redirectUrl = `${process.env.CLIENT_URL}/google-auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}&id=${req.user._id}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`;
//     return res.redirect(redirectUrl);
//   } else {
//     res.redirect(`${process.env.CLIENT_URL}/login`);
//   }
// };


// exports.getGoogleLoginPage = async (req, res) => {
//   if (req.user)
//     return res.redirect("/");
//   const state = generateState();
//   const codeVerifier = generateCodeVerifier();
//   const url = google.createAuthorizationURL(state, codeVerifier, [
//     "openid",
//     "profile",
//     "email",
//   ]);
//   const cookieConfig = {
//     httpOnly: true,
//     secure: true,
//     maxAge: OAUTH_EXCHANGE_EXPIRY,
//     sameSite: "lax",
//   };
//   res.cookie("google_oauth_state", state, cookieConfig);
//   res.cookie("google_code_verifier", codeVerifier, cookieConfig);
//   res.redirect(url.toString());
// };
// exports.googleCallback = async (req, res) => {
//   try {
//     // 1. Validate state/csrf etc.
//     const state = req.cookies.google_oauth_state;
//     const codeVerifier = req.cookies.google_code_verifier;
//     if (!state || !codeVerifier)
//       return res.status(400).send("Missing OAuth state or code verifier");

//     if (req.query.state !== state)
//       return res.status(400).send("Invalid state parameter");

//     const { code } = req.query;
//     if (!code) return res.status(400).send("Missing code");

//     // 2. Exchange code for tokens
//     const tokens = await google.validateAuthorizationCode(code, codeVerifier);

//     // 3. Get user info from Google
//     const userinfo = await google.getUser(tokens.accessToken);

//     // userinfo contains: sub (Google ID), email, name, picture, etc.
//     const providerAccountId = userinfo.sub;
//     const email = userinfo.email;
//     const name = userinfo.name;

//     // 4. Find or create user and OauthAccount
//     let oauthAccount = await OauthAccount.findOne({
//       provider: 'google',
//       providerAccountId,
//     }).populate('userId');

//     let user;
//     if (oauthAccount) {
//       user = oauthAccount.userId;
//     } else {
//       // If user with this email exists, link OauthAccount to existing user
//       user = await User.findOne({ email });
//       if (!user) {
//         // Create new user
//         user = new User({
//           name: name || email.split('@')[0],
//           email,
//           password: '', // No password for social login
//         });
//         await user.save();
//       }
//       // Create OauthAccount
//       oauthAccount = new OauthAccount({
//         userId: user._id,
//         provider: 'google',
//         providerAccountId,
//       });
//       await oauthAccount.save();
//     }

//     // 5. Issue tokens (same as your login)
//     const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });
//     const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     // 6. Send tokens to frontend (choose one):
//     // Option 1: Redirect to frontend with tokens in URL (not recommended for long tokens)
//     // Option 2: Set HTTP-only cookies (recommended for security)
//     // Option 3: Redirect with a short-lived code, then exchange for tokens via API

//     // Here we'll use Option 1 for simplicity (but you should use cookies for production)
//     const redirectUrl = `${process.env.CLIENT_URL}/google-auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}&id=${user._id}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`;
//     res.clearCookie("google_oauth_state");
//     res.clearCookie("google_code_verifier");
//     return res.redirect(redirectUrl);

//   } catch (err) {
//     console.error(err);
//     return res.status(500).send("Google OAuth failed");
//   }
// };

// // exports.getGoogleLoginPage = async(req,res)=>{
// //   if(req.user)
// //     return res.redirect("/");
// //   const state=generateState();
// //   const codeVerifier=generateCodeVerifier();
// //   const url=google.createAuthorizationURL(state,codeVerifier,[
// //     "openid", //this is called scopes, here we're giving openid and profile (this contain google id of user which is unique)
// //     "profile", //openid gives tokens if needed and profile gives user information
// //     //we're telling google about the information that we require from user
// //     "email",
// //   ]); 
// // const cookieConfig={
// //   httpOnly : true,
// //   secure: true,
// //   maxAge: OAUTH_EXCHANGE_EXPIRY,
// //   sameSite: "lax", //this is such that when google redirects to our website cookies are maintained
// // }
// // res.cookie("google_oauth_state",state,cookieConfig);
// // res.cookie("google_code_verifier",codeVerifier,cookieConfig);

// // res.redirect(url.toString());

// // };