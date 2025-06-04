const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const OauthAccount = require('../models/OauthAccounts');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if OauthAccount exists
      let oauthAccount = await OauthAccount.findOne({
        provider: 'google',
        providerAccountId: profile.id
      }).populate('userId');

      if (oauthAccount) {
        // If exists, return associated user
        return done(null, oauthAccount.userId);
      }

      // Else: Check if user exists by email
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: '', // Not used for social login
        });
      }

      // Create OauthAccount entry
      oauthAccount = await OauthAccount.create({
        userId: user._id,
        provider: 'google',
        providerAccountId: profile.id,
      });

      return done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;

// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: 'http://localhost:5000/api/auth/google/callback',
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       let user = await User.findOne({ googleId: profile.id });
//       if (!user) {
//         user = await User.create({
//           googleId: profile.id,
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           password: '', // no password for social login
//         });
//       }
//       done(null, user);
//     } catch (err) {
//       done(err, null);
//     }
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });

// module.exports = passport;