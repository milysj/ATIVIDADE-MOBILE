import { Response, NextFunction } from 'express';
import { Content } from '../models/Content';
import { AuthRequest } from '../middlewares/authMiddleware';

export class ContentController {
  // GET /api/conteudos - Consulta e Pesquisa
  public static async getAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { busca, search, categoria } = req.query;
      const termo = (busca || search) as string | undefined;

      const filtro: any = {};

      // Filtro de pesquisa textual caso informado termo de busca
      if (termo && termo.trim() !== '') {
        const regex = new RegExp(termo.trim(), 'i');
        filtro.$or = [
          { titulo: { $regex: regex } },
          { subtitulo: { $regex: regex } },
          { descricao: { $regex: regex } },
        ];
      }

      // Filtro por categoria
      if (categoria && typeof categoria === 'string') {
        filtro.categoria = categoria;
      }

      const conteudos = await Content.find(filtro).sort({ createdAt: -1 });

      res.status(200).json({
        sucesso: true,
        total: conteudos.length,
        dados: conteudos,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/conteudos/:id - Consulta de um conteúdo específico
  public static async getById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const conteudo = await Content.findById(id);

      if (!conteudo) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Conteúdo não encontrado.',
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        dados: conteudo,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/conteudos - Cadastra novo conteúdo (Área administrativa)
  public static async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { titulo, subtitulo, imagem, descricao, categoria } = req.body;

      if (!titulo || !subtitulo || !imagem) {
        res.status(400).json({
          sucesso: false,
          mensagem: 'Título, subtítulo e imagem são campos obrigatórios.',
        });
        return;
      }

      const novoConteudo = new Content({
        titulo,
        subtitulo,
        imagem,
        descricao: descricao || '',
        categoria: categoria || 'Séries',
        usuario: req.userId || null,
      });

      await novoConteudo.save();

      res.status(201).json({
        sucesso: true,
        mensagem: 'Conteúdo cadastrado com sucesso!',
        dados: novoConteudo,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/conteudos/:id - Altera conteúdo / imagem (Área administrativa)
  public static async update(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { titulo, subtitulo, imagem, descricao, categoria } = req.body;

      const conteudo = await Content.findById(id);

      if (!conteudo) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Conteúdo não encontrado.',
        });
        return;
      }

      if (titulo !== undefined) conteudo.titulo = titulo;
      if (subtitulo !== undefined) conteudo.subtitulo = subtitulo;
      if (imagem !== undefined) conteudo.imagem = imagem;
      if (descricao !== undefined) conteudo.descricao = descricao;
      if (categoria !== undefined) conteudo.categoria = categoria;

      await conteudo.save();

      res.status(200).json({
        sucesso: true,
        mensagem: 'Conteúdo atualizado com sucesso!',
        dados: conteudo,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/conteudos/:id - Exclui conteúdo / imagem (Área administrativa)
  public static async delete(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const conteudo = await Content.findByIdAndDelete(id);

      if (!conteudo) {
        res.status(404).json({
          sucesso: false,
          mensagem: 'Conteúdo não encontrado.',
        });
        return;
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Conteúdo excluído com sucesso!',
      });
    } catch (error) {
      next(error);
    }
  }
}
