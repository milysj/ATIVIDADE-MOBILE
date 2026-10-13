import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/usuarios - Lista todos os usuários
router.get('/', UserController.getAll);

// GET /api/usuarios/perfil - Perfil do usuário autenticado
router.get('/perfil', authMiddleware, UserController.getProfile);

// GET /api/usuarios/:id - Busca usuário por ID
router.get('/:id', UserController.getById);

// PUT /api/usuarios/:id - Atualiza usuário (requer autenticação)
router.put('/:id', authMiddleware, UserController.update);

// DELETE /api/usuarios/:id - Remove usuário (requer autenticação)
router.delete('/:id', authMiddleware, UserController.delete);

export default router;
