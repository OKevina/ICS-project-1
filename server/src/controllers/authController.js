const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, phone, password, role } = req.body;

    // Admin login
    if (role === 'ADMIN') {
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required for admin login' });
      }

      const admin = await prisma.user.findUnique({
        where: { email, role: 'ADMIN' }
      });

      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = jwt.sign(
        { userId: admin.id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({ token, user: { id: admin.id, name: admin.name, role: admin.role } });
    }

    // Farmer/Consumer login
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const user = await prisma.user.findFirst({
      where: { phone, role: { in: ['FARMER', 'CONSUMER'] } }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate and save OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.oTP.create({
      data: {
        code: otp,
        phone,
        expiresAt,
        userId: user.id
      }
    });

    // In production, send OTP via SMS service
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({ message: 'OTP sent successfully', userId: user.id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Register controller
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, farmName, location, address } = req.body;

    // Validate required fields based on role
    if (role === 'ADMIN' && (!email || !password)) {
      return res.status(400).json({ message: 'Email and password are required for admin registration' });
    }

    if (role === 'FARMER' && (!name || !phone || !farmName || !location)) {
      return res.status(400).json({ message: 'Name, phone, farm name, and location are required for farmer registration' });
    }

    if (role === 'CONSUMER' && (!name || !phone || !address)) {
      return res.status(400).json({ message: 'Name, phone, and address are required for consumer registration' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phone: phone || undefined }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    // Create user
    const userData = {
      name,
      role,
      ...(email && { email }),
      ...(phone && { phone }),
      ...(password && { password: await bcrypt.hash(password, 10) }),
      ...(farmName && { farmName }),
      ...(location && { location }),
      ...(address && { address })
    };

    const user = await prisma.user.create({
      data: userData
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify OTP controller
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const otpRecord = await prisma.oTP.findFirst({
      where: {
        userId,
        code: otp,
        used: false,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { used: true }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: otpRecord.user.id, role: otpRecord.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: otpRecord.user.id,
        name: otpRecord.user.name,
        role: otpRecord.user.role
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 