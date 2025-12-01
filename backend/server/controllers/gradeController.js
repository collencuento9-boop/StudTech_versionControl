// server/controllers/gradeController.js
const pool = require('../config/db');

const updateGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const { grades, average } = req.body;

    const [[student]] = await pool.query('SELECT 1 FROM students WHERE id = ?', [id]);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    await pool.query('DELETE FROM grades WHERE student_id = ?', [id]);

    for (const [subject, q] of Object.entries(grades)) {
      await pool.query(
        `INSERT INTO grades (student_id, subject, q1, q2, q3, q4)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, subject, q.q1 || 0, q.q2 || 0, q.q3 || 0, q.q4 || 0]
      );
    }

    await pool.query('UPDATE students SET average = ? WHERE id = ?', [average || 0, id]);

    res.json({ message: 'Grades updated', average });
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
};

const getStudentGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM grades WHERE student_id = ?', [id]);

    const result = {};
    rows.forEach(r => {
      result[r.subject] = {
        q1: r.q1, q2: r.q2, q3: r.q3, q4: r.q4,
        average: parseFloat(r.average)
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
};

const getStudentsWithGrades = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, COALESCE(AVG(g.average), 0) as calculated_average
      FROM students s
      LEFT JOIN grades g ON s.id = g.student_id
      GROUP BY s.id
      ORDER BY calculated_average DESC
    `);

    res.json(rows.map(row => ({
      ...formatStudent(row),
      average: parseFloat(row.calculated_average || row.average || 0)
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
};

module.exports = { updateGrades, getStudentGrades, getStudentsWithGrades };