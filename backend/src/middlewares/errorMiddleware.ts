import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Erro capturado no servidor:', err);

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const mensagens = Object.values(err.errors).map((val: any) => val.message);
    res.status(400).json({
      sucesso: false,
      mensagem: 'Erro de validação',
      erros: mensagens,
    });
    return;
  }

  // Erro de chave duplicada (e-mail já cadastrado)
  if (err.code === 11000) {
    res.status(400).json({
      sucesso: false,
      mensagem: 'E-mail já cadastrado no sistema.',
    });
    return;
  }

  // Erro de Cast do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    res.status(400).json({
      sucesso: false,
      mensagem: 'ID informado possui formato inválido.',
    });
    return;
  }

  res.status(err.status || 500).json({
    sucesso: false,
    mensagem: err.message || 'Erro interno no servidor.',
  });
};
