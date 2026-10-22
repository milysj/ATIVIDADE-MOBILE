import { Schema, model, Document, Types } from 'mongoose';

export interface IEpisodio {
  numero: number;
  titulo: string;
  duracao?: string;
  descricao?: string;
}

export interface IContent extends Document {
  titulo: string;
  subtitulo: string;
  imagem: string;
  descricao?: string;
  categoria?: string;
  episodios?: IEpisodio[];
  usuario?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const episodioSchema = new Schema<IEpisodio>(
  {
    numero: { type: Number, required: true },
    titulo: { type: String, required: true, trim: true },
    duracao: { type: String, default: '45 min', trim: true },
    descricao: { type: String, default: '', trim: true },
  },
  { _id: false }
);

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
    episodios: {
      type: [episodioSchema],
      default: [],
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

