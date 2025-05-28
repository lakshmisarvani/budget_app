exports.healthCheck = (req, res) => {
  res.status(200).json({ message: '✅ Secure Budget App Backend is running' });
};
