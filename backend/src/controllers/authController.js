const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Default role for new registrations is CLIENTE
    const roleRecord = await Role.findByName('CLIENTE');
    if (!roleRecord) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const userId = await User.create({
      email,
      password_hash,
      role_id: roleRecord.id
    });

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;

    let user = await User.findByEmail(email);

    if (!user) {
      const roleRecord = await Role.findByName('CLIENTE');
      if (!roleRecord) {
        return res.status(400).json({ message: 'Default role CLIENTE not found' });
      }

      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(googleId + (process.env.JWT_SECRET || 'secret'), salt);

      const userId = await User.create({
        email,
        password_hash: randomPassword,
        role_id: roleRecord.id
      });
      user = { id: userId, email, role_id: roleRecord.id };
    }

    const jwtPayload = {
      user: {
        id: user.id,
        role_id: user.role_id
      }
    };

    jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, jwtToken) => {
        if (err) throw err;
        res.json({ token: jwtToken, user: { id: user.id, email: user.email, role_id: user.role_id } });
      }
    );
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role_id: user.role_id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, email: user.email, role_id: user.role_id } });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
