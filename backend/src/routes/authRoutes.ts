import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// POST /api/auth/register - Cadastro de novo usuário
router.post('/register', AuthController.register);

// POST /api/auth/login - Autenticação de usuário
router.post('/login', AuthController.login);

export default router;
