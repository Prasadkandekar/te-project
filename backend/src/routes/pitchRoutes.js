const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createPitch,
  getPitches,
  getPitchById,
  updatePitch,
  deletePitch,
  getMyPitches,
} = require('../controllers/pitchController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../utils/validateInputs');
const { z } = require('zod');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for pitch decks
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF and PowerPoint files
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and PowerPoint files are allowed.'));
    }
  }
});

// Validation schemas
const createPitchSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  isPublic: z.boolean().optional(),
});

// Pitch routes
router.get('/', authMiddleware, getPitches);
router.post('/', authMiddleware, upload.single('file'), validate(createPitchSchema), createPitch);
router.get('/my-pitches', authMiddleware, getMyPitches);
router.get('/:id', authMiddleware, getPitchById);
router.put('/:id', authMiddleware, upload.single('file'), updatePitch);
router.delete('/:id', authMiddleware, deletePitch);

module.exports = router;