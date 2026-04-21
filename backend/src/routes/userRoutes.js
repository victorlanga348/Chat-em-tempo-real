import { Router } from 'express';
import { register, login, profile } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authMiddleware, profile);

export default router;