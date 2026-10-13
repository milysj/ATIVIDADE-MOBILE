import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorMiddleware';

const app: Application = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas da API
app.use('/api', routes);

// Rota raiz informativa
app.get('/', (req: Request, res: Response) => {
  res.json({
    projeto: 'API AtividadeTemplate - Express, TypeScript e MongoDB',
    status: 'online',
    documentacao: '/api/status',
  });
});

// Tratamento de rota não encontrada (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    sucesso: false,
    mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Middleware centralizado de tratamento de erros
app.use(errorHandler);

export default app;
