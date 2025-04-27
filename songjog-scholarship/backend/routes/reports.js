const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.findAll({ include: ['Student', 'Sponsor'] });
    const format = req.query.format || 'json';
    if (format === 'csv') {
      const fields = ['id', 'amount', 'date', 'type', 'status', 'Student.name', 'Sponsor.name'];
      const parser = new Parser({ fields });
      const csv = parser.parse(payments);
      res.header('Content-Type', 'text/csv');
      res.attachment('payments.csv');
      return res.send(csv);
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      res.header('Content-Type', 'application/pdf');
      res.attachment('payments.pdf');
      doc.pipe(res);
      doc.fontSize(20).text('Payment Report', { align: 'center' });
      payments.forEach(p => {
        doc.fontSize(12).text(`ID: ${p.id}, Amount: ${p.amount}, Student: ${p.Student.name}, Sponsor: ${p.Sponsor.name}`);
      });
      doc.end();
    } else {
      res.json(payments);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await Student.findAll();
    const format = req.query.format || 'json';
    if (format === 'csv') {
      const fields = ['id', 'name', 'email', 'academic_records.gpa', 'financial_status.income'];
      const parser = new Parser({ fields });
      const csv = parser.parse(students);
      res.header('Content-Type', 'text/csv');
      res.attachment('students.csv');
      return res.send(csv);
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      res.header('Content-Type', 'application/pdf');
      res.attachment('students.pdf');
      doc.pipe(res);
      doc.fontSize(20).text('Student Report', { align: 'center' });
      students.forEach(s => {
        doc.fontSize(12).text(`ID: ${s.id}, Name: ${s.name}, GPA: ${s.academic_records?.gpa || 'N/A'}`);
      });
      doc.end();
    } else {
      res.json(students);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;