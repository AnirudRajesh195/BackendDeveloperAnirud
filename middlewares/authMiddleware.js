const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.header('Authorization');  
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Extract token from 'Bearer <token>'
  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token with the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach the decoded token data to the request object
    next();  // Move to the next middleware or route handler
  } catch (err) {
    console.error('Token verification error:', err.message); // Add logging for debugging
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
