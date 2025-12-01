// server/routes/deleteRequests.js
const express = require('express');
const router = express.Router();
const {
  createDeleteRequest,
  getPendingRequests,
  updateRequestStatus
} = require('../controllers/deleteRequestController');

router.post('/', createDeleteRequest);
router.get('/', getPendingRequests);
router.put('/:id', updateRequestStatus);

module.exports = router;