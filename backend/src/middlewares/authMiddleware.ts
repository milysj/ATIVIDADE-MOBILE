import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

interface JwtPayload {
  id: string;
  role: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      sucesso: false,
      mensagem: 'Acesso negado. Token de autenticação não fornecido.',
    });
    return;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      sucesso: false,
      mensagem: 'Formato do token inválido. Use: Bearer <token>',
    });
    return;
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET || 'eunaoseioquecolocaraquisecreto';

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({
      sucesso: false,
      mensagem: 'Token inválido ou expirado.',
    });
    return;
  }
};

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.userRole !== 'admin') {
    res.status(403).json({
      sucesso: false,
      mensagem: 'Acesso restrito. Apenas administradores podem executar esta operação.',
    });
    return;
  }
  next();
};

