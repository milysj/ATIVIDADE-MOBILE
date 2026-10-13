import { Schema, model, Document, Types } from 'mongoose';

export interface IContent extends Document {
  titulo: string;
  subtitulo: string;
  imagem: string;
  descricao?: string;
  categoria?: string;
  usuario?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema<IContent>(
  {
    titulo: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
    },
    subtitulo: {
      type: String,
      required: [true, 'O subtítulo é obrigatório'],
      trim: true,
    },
    imagem: {
      type: String,
      required: [true, 'A URL da imagem é obrigatória'],
      trim: true,
    },
    descricao: {
      type: String,
      default: '',
      trim: true,
    },
    categoria: {
      type: String,
      default: 'Séries',
      trim: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Índice de texto para otimizar pesquisas
contentSchema.index({ titulo: 'text', subtitulo: 'text', descricao: 'text' });

export const Content = model<IContent>('Content', contentSchema);
