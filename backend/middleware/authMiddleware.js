const jwt = require('jsonwebtoken');
function authMiddleware(req, res, next) {
  // Try to get token from cookie first
  let token = req.cookies.accessToken;

  // Optionally, allow Bearer token in Authorization header as a fallback
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

module.exports = authMiddleware;


// const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized: No token provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user =decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Unauthorized: Invalid token' });
//   }
// };


// function authMiddleware(req, res, next) {
//   const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json({ message: 'No token, unauthorized' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// }


// module.exports = authMiddleware;
