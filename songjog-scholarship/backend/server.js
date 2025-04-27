const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/database');
const authMiddleware = require('./middleware/auth');
const rateLimitMiddleware = require('./middleware/rateLimit');
const csrfMiddleware = require('./middleware/csrf');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const helmet = require('helmet');
const sanitize = require('express-sanitizer');
const { Server } = require('socket.io');
const http = require('http');
const { uploadToGoogleDrive } = require('./services/googleDrive');
const pdfkit = require('pdfkit');
const { Parser } = require('json2csv');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Security middleware
app.use(helmet());
app.use(sanitize());
app.use(cors());
app.use(express.json());
app.use(rateLimitMiddleware);
app.use(csrfMiddleware);

// File uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF/image files allowed!'));
    }
  },
});
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/students', authMiddleware, require('./routes/students'));
app.use('/api/sponsors', authMiddleware, require('./routes/sponsors'));
app.use('/api/payments', authMiddleware, require('./routes/payments'));
app.use('/api/applications', authMiddleware, require('./routes/applications'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', authMiddleware, require('./routes/messages'));
app.use('/api/reports', authMiddleware, require('./routes/reports'));

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Reminder cron job
cron.schedule('0 0 * * *', async () => {
  const { Op } = require('sequelize');
  const Payment = require('./models/Payment');
  const payments = await Payment.findAll({
    where: {
      status: 'pending',
      date: { [Op.lte]: new Date() },
    },
  });
  for (const payment of payments) {
    await transporter.sendMail({
      to: payment.sponsor.email,
      subject: 'Payment Reminder',
      text: `Please complete your ${payment.type} payment of ${payment.amount} for student ID ${payment.student_id}.`,
    });
    io.emit('notification', { userId: payment.sponsorId, message: `Payment reminder for student ${payment.studentId}` });
  }
});

// AI matching
app.post('/api/match', authMiddleware, async (req, res) => {
  const { sponsorId } = req.body;
  const Sponsor = require('./models/Sponsor');
  const Student = require('./models/Student');
  const sponsor = await Sponsor.findByPk(sponsorId);
  const students = await Student.findAll();
  const matches = students.map(student => {
    let score = 0;
    if (sponsor.preferences?.field === student.academic_records?.field) score += 0.4;
    if (sponsor.preferences?.location === student.address?.city) score += 0.3;
    if (student.academic_records?.gpa >= sponsor.preferences?.min_gpa) score += 0.2;
    if (student.financial_status?.income < sponsor.preferences?.max_income) score += 0.1;
    return { student, score };
  }).sort((a, b) => b.score - a.score);
  res.json(matches.slice(0, 5));
});

// WebSocket notifications
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Database sync failed:', err));