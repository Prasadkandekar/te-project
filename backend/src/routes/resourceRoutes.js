const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  createResource,
  getResources,
  getResourceById,
  downloadResource,
  updateResource,
  deleteResource,
  getMyResources,
} = require('../controllers/resourceController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const { validate, createResourceSchema } = require('../utils/validateInputs');

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
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document and image formats
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, images, and text files are allowed.'));
    }
  }
});

// Resource routes
router.get('/', authMiddleware, getResources);
router.post('/', authMiddleware, upload.single('file'), validate(createResourceSchema), createResource);
router.get('/my-resources', authMiddleware, getMyResources);
router.get('/:id', authMiddleware, getResourceById);
router.get('/:id/download', authMiddleware, downloadResource);
router.put('/:id', authMiddleware, upload.single('file'), updateResource);
router.delete('/:id', authMiddleware, deleteResource);

module.exports = router;