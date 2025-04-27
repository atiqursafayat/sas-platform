const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Log = require('../models/Log');
const { uploadToGoogleDrive } = require('../services/googleDrive');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.fields([{ name: 'certificates', maxCount: 5 }, { name: 'profile_picture', maxCount: 1 }]), async (req, res) => {
  const { name, email, phone, address, dob, academic_records, financial_status, bio, goals } = req.body;
  try {
    const certificateFiles = req.files.certificates?.map(async (file) => {
      const fileId = await uploadToGoogleDrive(file);
      return fileId;
    }) || [];
    const profilePicture = req.files.profile_picture ? await uploadToGoogleDrive(req.files.profile_picture[0]) : null;
    let student = await Student.findOne({ where: { email } });
    const userId = req.user.id;
    if (student) {
      student = await Student.update(
        {
          name, email, phone, address: JSON.parse(address), dob,
          academic_records: JSON.parse(academic_records),
          financial_status: JSON.parse(financial_status),
          bio, goals, certificates: await Promise.all(certificateFiles),
          profile_picture: profilePicture
        },
        { where: { email } }
      );
      await Log.create({ action: `Updated student profile: ${email}`, userId });
    } else {
      student = await Student.create({
        name, email, phone, address: JSON.parse(address), dob,
        academic_records: JSON.parse(academic_records),
        financial_status: JSON.parse(financial_status),
        bio, goals, certificates: await Promise.all(certificateFiles),
        profile_picture: profilePicture
      });
      await Log.create({ action: `Created student profile: ${email}`, userId });
    }
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const students = await Student.findAll();
  res.json(students);
});

router.get('/:id', async (req, res) => {
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

module.exports = router;