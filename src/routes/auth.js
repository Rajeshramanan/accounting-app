import express from 'express';
import { registerCompany, loginCompany, adminLogin, getAllUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', registerCompany);
router.post('/login', loginCompany);
router.post('/admin-login', adminLogin);
router.get('/admin/users', getAllUsers);

export default router;
