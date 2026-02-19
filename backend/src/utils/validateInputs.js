const { z } = require('zod');

// Auth validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ENTREPRENEUR', 'MENTOR']).optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// Idea validation schemas
const createIdeaSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  category: z.string().min(1, 'Category is required'),
  targetMarket: z.string().max(500).optional(),
  challenges: z.string().max(1000).optional(),
  stage: z.enum(['CONCEPT', 'VALIDATION', 'MVP', 'GROWTH']).optional(),
});

const updateIdeaSchema = createIdeaSchema.partial();

// Feedback validation schema
const createFeedbackSchema = z.object({
  comment: z.string().min(10, 'Feedback must be at least 10 characters').max(1000),
  rating: z.number().min(1).max(5).optional(),
});

// Connection validation schema
const createConnectionSchema = z.object({
  receiverId: z.string().uuid('Invalid receiver ID'),
  message: z.string().max(500).optional(),
});

const updateConnectionSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
});

// Resource validation schema
const createResourceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1, 'Category is required'),
  isPublic: z.boolean().optional(),
});

// Profile update schema
const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().max(100).optional(),
});

// Idea validation schema - TEMPORARILY DISABLED
/*
const validateIdeaSchema = z.object({
  ideaName: z.string().min(3, 'Idea name must be at least 3 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  targetMarket: z.string().min(10, 'Target market description must be at least 10 characters').max(1000),
  uniqueValue: z.string().min(10, 'Unique value proposition must be at least 10 characters').max(1000),
  businessModel: z.string().min(10, 'Business model must be at least 10 characters').max(1000),
});
*/

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  createIdeaSchema,
  updateIdeaSchema,
  createFeedbackSchema,
  createConnectionSchema,
  updateConnectionSchema,
  createResourceSchema,
  updateProfileSchema,
  // validateIdeaSchema, // Temporarily disabled
  validate,
};