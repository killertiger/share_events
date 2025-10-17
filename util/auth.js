import jwt from 'jsonwebtoken';

// Secret key for signing JWTs (in production, use env variable)
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// Function to generate a JWT for a user
export function generateJWT(user) {
  // user: { id, email }
  const payload = {
    id: user.id,
    email: user.email,
  };
  // Expires in 3 days
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '3d' });
}

// Function to verify a JWT and return its payload (or null if invalid)
export function verifyJWT(token) {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
}

// Middleware to authenticate requests using JWT
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyJWT(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}