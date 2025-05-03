module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'judge') {
      next();
    } else {
      res.status(403).json({ message: 'Judge access required' });
    }
  };
