import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/authMiddleware';

export class UserController {
  // GET /api/usuarios
  public static async getAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const usuarios = await User.find().select('-senha');
      res.status(200).json({
        sucesso: true,
        total: usuarios.length,
        dados: usuarios,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/usuarios/perfil
  public static async getProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ sucesso: false, mensagem: 'Usuário não autenticado.' });
        return;
      }

      const usuario = await User.findById(req.userId).select('-senha');
      if (!usuario) {
        res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: usuario,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/usuarios/:id
  public static async getById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const usuario = await User.findById(id).select('-senha');

      if (!usuario) {
        res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: usuario,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/usuarios/:id
  public static async update(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, email, telefone, cpf, imagem, senha } = req.body;

      const usuario = await User.findById(id);
      if (!usuario) {
        res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
        return;
      }

      if (nome) usuario.nome = nome;
      if (email) usuario.email = email;
      if (telefone !== undefined) usuario.telefone = telefone;
      if (cpf !== undefined) usuario.cpf = cpf;
      if (imagem !== undefined) usuario.imagem = imagem;

      // Se enviou nova senha, atualiza e criptografa
      if (senha && senha.trim().length >= 6) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(senha, salt);
      }

      await usuario.save();

      const usuarioAtualizado = await User.findById(id).select('-senha');

      res.status(200).json({
        sucesso: true,
        mensagem: 'Usuário atualizado com sucesso!',
        dados: usuarioAtualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/usuarios/:id
  public static async delete(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const usuario = await User.findByIdAndDelete(id);
      if (!usuario) {
        res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
        return;
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Usuário excluído com sucesso!',
      });
    } catch (error) {
      next(error);
    }
  }
}
