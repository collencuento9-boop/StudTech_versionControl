// server/controllers/deleteRequestController.js
const pool = require('../config/db');

const createDeleteRequest = async (req, res) => {
  try {
    const { studentId, studentName, studentLRN, requestedBy, reason = '' } = req.body;

    if (!studentId || !studentName || !studentLRN || !requestedBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await pool.query(
      `INSERT INTO delete_requests (student_id, student_name, student_lrn, requested_by, reason)
       VALUES (?, ?, ?, ?, ?)`,
      [studentId, studentName, studentLRN, requestedBy, reason]
    );

    // ← THIS LINE WAS MISSING A CLOSING )
    const [[request]] = await pool.query(
      'SELECT * FROM delete_requests WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ message: 'Delete request submitted', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed', details: err.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const [requests] = await pool.query(
      `SELECT * FROM delete_requests WHERE status = 'Pending' ORDER BY request_date DESC`
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [[request]] = await pool.query('SELECT * FROM delete_requests WHERE id = ?', [id]);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    await pool.query('UPDATE delete_requests SET status = ? WHERE id = ?', [status, id]);

    if (status === 'Approved') {
      await pool.query('DELETE FROM students WHERE id = ?', [request.student_id]);
    }

    res.json({ message: `Request ${status.toLowerCase()}`, request: { ...request, status } });
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
};

module.exports = { createDeleteRequest, getPendingRequests, updateRequestStatus };