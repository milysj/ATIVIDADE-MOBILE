import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const gerarToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'eunaoseioquecolocaraquisecreto';
  return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
};

export class AuthController {
  // POST /api/auth/register
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { nome, email, senha, telefone, cpf, imagem, role } = req.body;

      if (!nome || !email || !senha) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Nome, e-mail e senha são obrigatórios.',
        });
        return;
      }

      // Verifica se usuário já existe
      const usuarioExistente = await User.findOne({ email });
      if (usuarioExistente) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Este e-mail já está cadastrado.',
        });
        return;
      }

      const roleFinal = role === 'admin' ? 'admin' : 'user';

      const novoUsuario = new User({
        nome,
        email,
        senha,
        telefone: telefone || '',
        cpf: cpf || '',
        imagem: imagem || '',
        role: roleFinal,
      });

      await novoUsuario.save();

      const token = gerarToken(novoUsuario._id.toString(), novoUsuario.role);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Usuário cadastrado com sucesso!',
        token,
        usuario: {
          id: novoUsuario._id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          telefone: novoUsuario.telefone,
          cpf: novoUsuario.cpf,
          imagem: novoUsuario.imagem,
          role: novoUsuario.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/login
  
  public static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Informe e-mail e senha.',
        });
        return;
      }

      const emailLimpo = email.trim().toLowerCase();
      const usuario = await User.findOne({ email: emailLimpo });
      if (!usuario) {
        res.status(401).json({
          sucesso: false,
          mensagem: 'E-mail ou senha inválidos.',
        });
        return;
      }

      const senhaCorreta = await usuario.compararSenha(senha);
      if (!senhaCorreta) {
        res.status(401).json({
          sucesso: false,
          mensagem: 'E-mail ou senha inválidos.',
        });
        return;
      }

      const token = gerarToken(usuario._id.toString(), usuario.role);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso!',
        token,
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          cpf: usuario.cpf,
          imagem: usuario.imagem,
          role: usuario.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
