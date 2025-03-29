const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');

// Enroll a student in a course
router.post('/', async (req, res) => {
  const { studentId, courseId } = req.body;
  try {
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: "Student or Course not found" });
    }

    const enrollment = await Enrollment.create({ student: studentId, course: courseId });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all enrollments (with student and course info)
router.get('/', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title description');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an enrollment
router.delete('/:id', async (req, res) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
