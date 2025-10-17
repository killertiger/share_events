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
