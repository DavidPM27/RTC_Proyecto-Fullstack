const User = require('../api/models/user.model')
const { verifyToken } = require('../utils/token')

const auth = (role = 'user') => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json("Unauthorized");
    try {
      const decoded = verifyToken(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        return res.status(401).json("Unauthorized");
      }
      
      if (role === 'admin' && req.user.role !== 'admin') {
        return res.status(403).json("Forbidden: Admins only");
      }
      
      next();
    } catch (error) {
      return res.status(401).json("Unauthorized");
    }
  }
}

module.exports = { auth }