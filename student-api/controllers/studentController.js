const Student = require('../models/Student');
const mongoose = require('mongoose');

// helper to check if an ID is valid MongoDB format
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/students - Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { rollNumber, name, email, department, enrollmentYear } = req.body;

    if (!rollNumber || !name || !email || !department || !enrollmentYear) {
      return res.status(400).json({
        success: false,
        message: 'rollNumber, name, email, department, and enrollmentYear are required',
      });
    }

    const student = await Student.create(req.body);
    res.status(201).json({ success: true, message: 'Student created', data: student });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ success: false, message: `${field} already exists` });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/students - Get all students with filtering and pagination
exports.getAllStudents = async (req, res) => {
  try {
    const { department, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (department) {
      filter.department = { $regex: department, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter).skip(skip).limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: students,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/students/search?name= - Search by name
exports.searchStudents = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ success: false, message: 'name query parameter is required' });
    }

    const students = await Student.find({ name: { $regex: name, $options: 'i' } });
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/students/:id - Get single student
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// PUT /api/students/:id - Full update
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const student = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, message: 'Student updated', data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// PATCH /api/students/:id - Partial update
exports.partialUpdateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const student = await Student.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, message: 'Student partially updated', data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// DELETE /api/students/:id - Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// PATCH /api/students/:id/deactivate - Soft delete
exports.deactivateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const student = await Student.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, message: 'Student deactivated', data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};