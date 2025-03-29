const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const sampleCourses = [
    { _id: '1', name: 'Mathematics', description: 'Learn numbers!' },
    { _id: '2', name: 'History', description: 'World past events' },
  ];
  router.get('/', (req, res) => {
    res.json(sampleCourses);
  });
  

// Create a new course
router.post('/', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
// Update a course
router.put('/:id', async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
