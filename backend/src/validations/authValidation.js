function validateRegisterInput(body) {
  const { name, email, password } = body;

  if (!name || !email || !password) {
    const err = new Error('Name, email, and password are required');
    err.statusCode = 400;
    throw err;
  }

  if (name.trim().length < 2) {
    const err = new Error('Name must be at least 2 characters');
    err.statusCode = 400;
    throw err;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const err = new Error('Please enter a valid email address');
    err.statusCode = 400;
    throw err;
  }

  if (password.length < 6) {
    const err = new Error('Password must be at least 6 characters');
    err.statusCode = 400;
    throw err;
  }
}

function validateLoginInput(body) {
  const { email, password } = body;

  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.statusCode = 400;
    throw err;
  }
}

module.exports = { validateRegisterInput, validateLoginInput };
