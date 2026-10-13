import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  nome: string;
  email: string;
  senha?: string;
  telefone?: string;
  cpf?: string;
  imagem?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  compararSenha(senhaInformada: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    nome: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'O e-mail é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    senha: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: [6, 'A senha deve conter no mínimo 6 caracteres'],
    },
    telefone: {
      type: String,
      default: '',
    },
    cpf: {
      type: String,
      default: '',
    },
    imagem: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

// Middleware pré-salvamento para criptografar senha
userSchema.pre('save', async function () {
  if (!this.isModified('senha') || !this.senha) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para verificar senha durante login
userSchema.methods.compararSenha = async function (senhaInformada: string): Promise<boolean> {
  return bcrypt.compare(senhaInformada, this.senha);
};

export const User = model<IUser>('User', userSchema);
