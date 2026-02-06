const express = require('express');
const router = express.Router();
const { sendAttendanceEmail } = require('../utils/emailService');
const { query } = require('../config/database');

// POST /api/attendance - Record attendance via QR scan
router.post('/', async (req, res) => {
  try {
    console.log('Attendance POST request body:', req.body);
    
    // Handle both QR scan format and mobile app format
    const { 
      studentId, 
      qrData, 
      location, 
      deviceInfo,
      // Mobile app format
      teacherId,
      teacherName,
      timestamp,
      date,
      time,
      status,
      period
    } = req.body;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // Get student data from MySQL database (users table)
    const students = await query('SELECT * FROM users WHERE role = "student"');
    console.log(`Found ${students.length} students in database`);
    console.log(`Looking for student with ID: ${studentId}`);
    
    // Check for student by ID
    const student = students.find(s => 
      s.id === studentId || 
      s.username === studentId
    );
    
    if (!student) {
      console.log('Student not found with ID:', studentId);
      console.log('Sample student IDs:', students.slice(0, 3).map(s => ({ id: s.id, username: s.username })));
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    console.log(`Found student: ${student.firstName} ${student.lastName}`);

    // Check if already recorded today
    const today = date || new Date().toISOString().split('T')[0];
    const existingRecords = await query(
      'SELECT * FROM attendance WHERE student_id = ? AND date = ?',
      [studentId, today]
    );

    // For mobile app, allow updating existing records
    if (existingRecords.length > 0 && !teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already recorded for today',
        data: existingRecords[0]
      });
    }

    // Create new attendance record
    const attendanceId = Date.now().toString();
    const currentTimestamp = timestamp || new Date().toISOString();
    const currentTime = time || new Date().toLocaleTimeString();
    
    // If updating existing record, delete old one
    if (existingRecords.length > 0 && teacherId) {
      await query('DELETE FROM attendance WHERE student_id = ? AND date = ?', [studentId, today]);
    }

    // Insert new record
    await query(
      `INSERT INTO attendance (
        id, student_id, student_name, grade_level, section,
        date, timestamp, time, status, period,
        location, teacher_id, teacher_name, device_info, qr_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        attendanceId,
        studentId,
        `${student.firstName} ${student.lastName}`.trim(),
        student.gradeLevel || 'N/A',
        student.section || 'N/A',
        today,
        currentTimestamp,
        currentTime,
        status || 'Present',
        period || 'morning',
        location || 'Mobile App',
        teacherId || null,
        teacherName || null,
        JSON.stringify(deviceInfo || {}),
        JSON.stringify(qrData || {})
      ]
    );

    // Get the inserted record
    const insertedRecords = await query('SELECT * FROM attendance WHERE id = ?', [attendanceId]);
    const attendanceRecord = insertedRecords[0];
    
    console.log('Saved attendance record:', attendanceRecord);

    res.json({
      success: true,
      message: 'Attendance recorded successfully',
      data: {
        id: attendanceRecord.id,
        studentId: attendanceRecord.student_id,
        studentName: attendanceRecord.student_name,
        gradeLevel: attendanceRecord.grade_level,
        section: attendanceRecord.section,
        date: attendanceRecord.date,
        timestamp: attendanceRecord.timestamp,
        time: attendanceRecord.time,
        status: attendanceRecord.status,
        period: attendanceRecord.period,
        location: attendanceRecord.location,
        teacherId: attendanceRecord.teacher_id,
        teacherName: attendanceRecord.teacher_name
      }
    });

  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/attendance - Get attendance records
router.get('/', async (req, res) => {
  try {
    const { date, studentId, gradeLevel, section } = req.query;
    
    let sqlQuery = 'SELECT * FROM attendance WHERE 1=1';
    const params = [];
    
    if (date) {
      sqlQuery += ' AND date = ?';
      params.push(date);
    }
    
    if (studentId) {
      sqlQuery += ' AND student_id = ?';
      params.push(studentId);
    }
    
    if (gradeLevel) {
      sqlQuery += ' AND grade_level = ?';
      params.push(gradeLevel);
    }
    
    if (section) {
      sqlQuery += ' AND section = ?';
      params.push(section);
    }
    
    sqlQuery += ' ORDER BY timestamp DESC';
    
    const records = await query(sqlQuery, params);
    
    // Transform snake_case to camelCase for frontend
    const transformedRecords = records.map(record => ({
      id: record.id,
      studentId: record.student_id,
      studentName: record.student_name,
      gradeLevel: record.grade_level,
      section: record.section,
      date: record.date instanceof Date ? record.date.toISOString().split('T')[0] : record.date,
      timestamp: record.timestamp,
      time: record.time,
      status: record.status,
      period: record.period,
      location: record.location,
      teacherId: record.teacher_id,
      teacherName: record.teacher_name,
      deviceInfo: record.device_info,
      qrData: record.qr_data,
      createdAt: record.created_at
    }));

    res.json({
      success: true,
      data: transformedRecords,
      count: transformedRecords.length
    });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/attendance/today - Get today's attendance
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const records = await query('SELECT * FROM attendance WHERE date = ? ORDER BY timestamp DESC', [today]);
    
    // Transform snake_case to camelCase
    const transformedRecords = records.map(record => ({
      id: record.id,
      studentId: record.student_id,
      studentName: record.student_name,
      gradeLevel: record.grade_level,
      section: record.section,
      date: record.date instanceof Date ? record.date.toISOString().split('T')[0] : record.date,
      timestamp: record.timestamp,
      time: record.time,
      status: record.status,
      period: record.period,
      location: record.location,
      teacherId: record.teacher_id,
      teacherName: record.teacher_name,
      deviceInfo: record.device_info,
      qrData: record.qr_data,
      createdAt: record.created_at
    }));

    res.json({
      success: true,
      data: transformedRecords,
      count: transformedRecords.length
    });

  } catch (error) {
    console.error('Error fetching today\'s attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/attendance/student/:id - Get attendance for specific student
router.get('/student/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const records = await query('SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC', [id]);
    
    // Transform snake_case to camelCase
    const transformedRecords = records.map(record => ({
      id: record.id,
      studentId: record.student_id,
      studentName: record.student_name,
      gradeLevel: record.grade_level,
      section: record.section,
      date: record.date instanceof Date ? record.date.toISOString().split('T')[0] : record.date,
      timestamp: record.timestamp,
      time: record.time,
      status: record.status,
      period: record.period,
      location: record.location,
      teacherId: record.teacher_id,
      teacherName: record.teacher_name,
      deviceInfo: record.device_info,
      qrData: record.qr_data,
      createdAt: record.created_at
    }));

    res.json({
      success: true,
      data: transformedRecords,
      count: transformedRecords.length
    });

  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// POST /api/attendance/send-email - Send attendance notification email to parent
router.post('/send-email', async (req, res) => {
  try {
    const {
      parentEmail,
      studentName,
      studentLRN,
      gradeLevel,
      section,
      status,
      period,
      time,
      teacherName
    } = req.body;

    if (!parentEmail) {
      return res.status(400).json({
        success: false,
        message: 'Parent email is required'
      });
    }

    if (!studentName) {
      return res.status(400).json({
        success: false,
        message: 'Student name is required'
      });
    }

    console.log(`📧 Sending attendance email to ${parentEmail} for ${studentName}`);

    const result = await sendAttendanceEmail({
      parentEmail,
      studentName,
      studentLRN,
      gradeLevel,
      section,
      status: status || 'present',
      period: period || 'morning',
      time: time || new Date().toLocaleTimeString(),
      teacherName
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;