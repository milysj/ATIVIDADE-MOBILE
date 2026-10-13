import { Router } from 'express';
import { ContentController } from '../controllers/ContentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// ==========================================
// Rotas Públicas (Usuários não autenticados podem visualizar e pesquisar)
// ==========================================

// GET /api/conteudos - Lista todos os conteúdos ou filtra por busca/categoria
router.get('/', ContentController.getAll);

// GET /api/conteudos/:id - Busca conteúdo específico por ID
router.get('/:id', ContentController.getById);

// ==========================================
// Rotas Protegidas (Apenas usuários autenticados na Área Administrativa)
// ==========================================

// POST /api/conteudos - Cadastra novo conteúdo
router.post('/', authMiddleware, ContentController.create);

// PUT /api/conteudos/:id - Edita conteúdo e imagem
router.put('/:id', authMiddleware, ContentController.update);

// DELETE /api/conteudos/:id - Exclui conteúdo e imagem
router.delete('/:id', authMiddleware, ContentController.delete);

export default router;
