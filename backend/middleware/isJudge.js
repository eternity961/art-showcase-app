module.exports = (req, res, next) => {
    if (req.user && (req.user.role === 'literal_judge' || req.user.role === 'visual_judge' || req.user.role === 'vocal_judge')) {  
      next();
    } else {
      res.status(403).json({ message: 'Judge access required' });
    }
  };
