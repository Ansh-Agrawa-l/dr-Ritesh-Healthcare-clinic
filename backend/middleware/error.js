module.exports = function(err, req, res, next) {
    console.error(err.stack);
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    res.status(500).json({ message: 'Server Error' });
  };