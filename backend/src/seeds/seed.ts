import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Content } from '../models/Content';

dotenv.config();

const seed = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/atividadedb';

  try {
    await mongoose.connect(mongoUri);
    console.log('Conectado ao MongoDB para executar o seed...');

    // Limpa registros anteriores
    await User.deleteMany({});
    await Content.deleteMany({});

    // Cria usuário padrão inicial
    const usuarioPadrao = new User({
      nome: 'Emerson',
      email: 'emerson@email.com',
      senha: '123456',
      telefone: '(15) 99999-9999',
      cpf: '000.000.000-00',
      role: 'admin',
    });

    await usuarioPadrao.save();
    console.log('👤 Usuário padrão criado: emerson@email.com / senha: 123456');

    // Cria conteúdos iniciais compatíveis com o template
    const conteudosIniciais = [
      {
        titulo: 'Breaking Bad',
        subtitulo: '1x01 - Pilot',
        imagem: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80',
        descricao: 'Um professor de química do ensino médio diagnosticado com câncer de pulmão inoperável se volta para a fabricação de metanfetamina.',
        categoria: 'Séries',
        usuario: usuarioPadrao._id,
      },
      {
        titulo: 'Stranger Things',
        subtitulo: '1x01 - O Desaparecimento de Will Byers',
        imagem: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
        descricao: 'Quando um garoto desaparece, uma pequena cidade descobre um mistério envolvendo experimentos secretos e forças sobrenaturais.',
        categoria: 'Séries',
        usuario: usuarioPadrao._id,
      },
      {
        titulo: 'Dark',
        subtitulo: '1x01 - Segredos',
        imagem: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',
        descricao: 'O desaparecimento de duas crianças em uma cidade alemã expõe os relacionamentos fraturados entre quatro famílias.',
        categoria: 'Séries',
        usuario: usuarioPadrao._id,
      },
    ];

    await Content.insertMany(conteudosIniciais);
    console.log('🎬 Conteúdos iniciais inseridos com sucesso!');

    await mongoose.disconnect();
    console.log('✅ Seed finalizado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a execução do seed:', error);
    process.exit(1);
  }
};

seed();
