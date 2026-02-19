const express = require('express');
const router = express.Router();
const {
  createConnection,
  getConnections,
  updateConnection,
  deleteConnection,
  getUsers,
} = require('../controllers/connectionController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate, createConnectionSchema, updateConnectionSchema } = require('../utils/validateInputs');

// Connection routes
router.get('/', authMiddleware, getConnections);
router.post('/', authMiddleware, validate(createConnectionSchema), createConnection);
router.put('/:id', authMiddleware, validate(updateConnectionSchema), updateConnection);
router.delete('/:id', authMiddleware, deleteConnection);

// User discovery routes
router.get('/users', authMiddleware, getUsers);

module.exports = router;