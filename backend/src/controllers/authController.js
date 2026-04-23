const asyncHandler = require('../utils/asyncHandler');
const { registerUser, loginUser } = require('../services/authService');
const { validateRegisterInput, validateLoginInput } = require('../validations/authValidation');

const register = asyncHandler(async (req, res) => {
  validateRegisterInput(req.body);
  const response = await registerUser(req.body);
  res.status(201).json(response);
});

const login = asyncHandler(async (req, res) => {
  validateLoginInput(req.body);
  const response = await loginUser(req.body);
  res.status(200).json(response);
});

module.exports = { register, login };
