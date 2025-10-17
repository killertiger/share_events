import { createUser, findUserByEmail, verifyUserCredentials } from '../models/User.js';
import { generateJWT } from '../util/auth.js';

// User signup controller
export async function signup(req, res) {
  try {
    const { email, password, name } = req.body;

    // Helper for trimming and checking empty or blank
    const isBlank = (str) =>
      typeof str !== 'string' || str.trim().length === 0;

    // Email regex (simple, not perfect but solid for basic usage)
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Validation: presence & not blank
    if (isBlank(email) || isBlank(password) || isBlank(name)) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required and must not be blank',
      });
    }

    // Validation: email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address provided',
      });
    }

    // Validation: password at least 6 chars, not all blanks
    if (password.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long and not blank',
      });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user
    const newUser = await createUser({ email, password, name });

    // Return user data (excluding password for security)
    const { password: _, ...userWithoutPassword } = newUser;

    // Generate JWT for the new user
    const token = generateJWT(newUser);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup',
    });
  }
};

// User login controller
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Use verifyUserCredentials (async, handles hash compare)
    const user = await verifyUserCredentials(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return user data (excluding password for security)
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT for the logged-in user
    const token = generateJWT(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};
