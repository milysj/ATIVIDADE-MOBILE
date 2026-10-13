import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import contentRoutes from './contentRoutes';

const router = Router();

// Rota de Health Check
router.get('/status', (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: 'API AtividadeTemplate está operacional!',
    timestamp: new Date().toISOString(),
  });
});

// Agrupamento de rotas
router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/conteudos', contentRoutes);

export default router;
