import { Router } from 'express';
import { ContentController } from '../controllers/ContentController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// ==========================================
// Rotas Públicas (Usuários não autenticados podem visualizar e pesquisar)
// ==========================================

// GET /api/conteudos - Lista todos os conteúdos ou filtra por busca/categoria
router.get('/', ContentController.getAll);

// GET /api/conteudos/:id - Busca conteúdo específico por ID
router.get('/:id', ContentController.getById);

// ==========================================
// Rotas Protegidas (Apenas Administradores)
// ==========================================

// POST /api/conteudos - Cadastra novo conteúdo
router.post('/', authMiddleware, adminMiddleware, ContentController.create);

// PUT /api/conteudos/:id - Edita conteúdo e imagem
router.put('/:id', authMiddleware, adminMiddleware, ContentController.update);

// DELETE /api/conteudos/:id - Exclui conteúdo e imagem
router.delete('/:id', authMiddleware, adminMiddleware, ContentController.delete);

export default router;
