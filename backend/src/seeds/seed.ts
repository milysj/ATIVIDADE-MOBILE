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

    // 1. Cria Administrador
    const adminUser = new User({
      nome: 'Administrador Tech',
      email: 'admin@email.com',
      senha: '123456',
      telefone: '(15) 99999-9999',
      cpf: '000.000.000-00',
      role: 'admin',
    });
    await adminUser.save();
    console.log('👑 Administrador criado: admin@email.com / senha: 123456');

    // 2. Cria Usuário Padrão
    const normalUser = new User({
      nome: 'João Usuário',
      email: 'usuario@email.com',
      senha: '123456',
      telefone: '(15) 98888-8888',
      cpf: '111.111.111-11',
      role: 'user',
    });
    await normalUser.save();
    console.log('👤 Usuário Padrão criado: usuario@email.com / senha: 123456');

    // Cria conteúdos iniciais variados (Séries, Filmes, Animes, Documentários)
    const conteudosIniciais = [
      // SÉRIES
      {
        titulo: 'Breaking Bad',
        subtitulo: '1ª Temporada Completa',
        imagem: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80',
        descricao: 'Um professor de química do ensino médio com câncer terminal se une a um ex-aluno para produzir e vender metanfetamina e garantir o futuro financeiro de sua família.',
        categoria: 'Séries',
        episodios: [
          { numero: 1, titulo: 'Piloto', duracao: '58 min', descricao: 'Walter White descobre que tem câncer e decide mudar o rumo da sua vida.' },
          { numero: 2, titulo: 'O Gato no Saco...', duracao: '48 min', descricao: 'Walt e Jesse precisam lidar com o resultado do primeiro negócio no deserto.' },
          { numero: 3, titulo: '...E o Saco no Rio', duracao: '48 min', descricao: 'Walt enfrenta uma decisão moral difícil no porão da casa de Jesse.' },
          { numero: 4, titulo: 'Câncer Man', duracao: '48 min', descricao: 'Walt conta a verdade para a família durante um churrasco.' },
        ],
        usuario: adminUser._id,
      },
      {
        titulo: 'Stranger Things',
        subtitulo: 'O Mundo Invertido',
        imagem: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
        descricao: 'Quando um garoto desaparece em circunstâncias misteriosas, uma cidadezinha descobre um mistério envolvendo experimentos secretos do governo e uma garotinha com poderes estranhos.',
        categoria: 'Séries',
        episodios: [
          { numero: 1, titulo: 'Capítulo 1: O Desaparecimento de Will Byers', duracao: '49 min', descricao: 'Will Byers desaparece sem deixar rastros ao voltar para casa à noite.' },
          { numero: 2, titulo: 'Capítulo 2: A Estranha da Rua Maple', duracao: '55 min', descricao: 'Os garotos encontram uma menina misteriosa no meio da floresta chuvosa.' },
          { numero: 3, titulo: 'Capítulo 3: Caramelo', duracao: '51 min', descricao: 'Joyce acredita que Will está tentando se comunicar através das luzes de Natal.' },
        ],
        usuario: adminUser._id,
      },

      // ANIMES
      {
        titulo: 'Attack on Titan',
        subtitulo: 'Shingeki no Kyojin - 1ª Temporada',
        imagem: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
        descricao: 'Após a destruição de sua cidade natal e a morte de sua mãe nas mãos de Titãs colossais, Eren Jaeger promete limpar a terra de todos os Titãs.',
        categoria: 'Animes',
        episodios: [
          { numero: 1, titulo: 'Para Você, em 2.000 Anos: A Queda de Shiganshina', duracao: '24 min', descricao: 'A humanidade vive em paz há 100 anos protegida por muralhas até a aparição de um Titã gigante.' },
          { numero: 2, titulo: 'Aquele Dia: A Queda de Shiganshina, Parte 2', duracao: '24 min', descricao: 'O caos se instala enquanto sobreviventes tentam evacuar a cidade invadida.' },
          { numero: 3, titulo: 'Uma Luz Tênue em Meio ao Desespero', duracao: '24 min', descricao: 'Eren, Mikasa e Armin iniciam seu treinamento na tropa de recrutas.' },
          { numero: 4, titulo: 'Noite de Graduação', duracao: '24 min', descricao: 'Os jovens soldados completam o treinamento e se preparam para a escolha das divisões.' },
        ],
        usuario: adminUser._id,
      },
      {
        titulo: 'Demon Slayer',
        subtitulo: 'Kimetsu no Yaiba',
        imagem: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80',
        descricao: 'Tanjiro Kamado é um garoto bondoso que vê sua família massacrada por demônios. Para curar sua irmã Nezuko, ele decide se tornar um caçador de demônios.',
        categoria: 'Animes',
        episodios: [
          { numero: 1, titulo: 'Crueldade', duracao: '23 min', descricao: 'Tanjiro retorna para casa e encontra uma terrível tragédia familiar.' },
          { numero: 2, titulo: 'O Treinador Sakonji Urokodaki', duracao: '23 min', descricao: 'Tanjiro e Nezuko encontram um misterioso mestre no Monte Sagiri.' },
          { numero: 3, titulo: 'Sabito e Makomo', duracao: '23 min', descricao: 'Um desafio para cortar uma grande rocha com sua espada de treino.' },
        ],
        usuario: adminUser._id,
      },

      // FILMES
      {
        titulo: 'Interestelar',
        subtitulo: 'Filme Completo - Ficção Científica',
        imagem: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&q=80',
        descricao: 'Com a Terra se tornando inabitável, um grupo de astronautas liderado por Cooper viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.',
        categoria: 'Filmes',
        episodios: [
          { numero: 1, titulo: 'Filme Completo (Versão Estendida)', duracao: '2h 49min', descricao: 'Experiência cinematográfica completa dirigida por Christopher Nolan.' },
        ],
        usuario: adminUser._id,
      },
      {
        titulo: 'Matrix',
        subtitulo: 'Filme Clássico Cyberpunk',
        imagem: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
        descricao: 'Um jovem programador descobre que a realidade em que vive é uma simulação criada por máquinas inteligentes que escravizaram a raça humana.',
        categoria: 'Filmes',
        episodios: [
          { numero: 1, titulo: 'Filme Completo (Remasterizado em 4K)', duracao: '2h 16min', descricao: 'A jornada pioneira de Neo, Morpheus e Trinity contra os agentes.' },
        ],
        usuario: adminUser._id,
      },

      // DOCUMENTÁRIOS
      {
        titulo: 'Nosso Planeta',
        subtitulo: 'Série Documental da Natureza',
        imagem: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        descricao: 'Experiencie as belezas naturais deslumbrantes da Terra e examine como a mudança climática impacta todas as criaturas vivas.',
        categoria: 'Documentários',
        episodios: [
          { numero: 1, titulo: 'Um Só Planeta', duracao: '49 min', descricao: 'A incrível diversidade de habitats ao redor do globo.' },
          { numero: 2, titulo: 'Mundos Congelados', duracao: '53 min', descricao: 'A luta pela sobrevivência nos polos gelados do Ártico e da Antártida.' },
          { numero: 3, titulo: 'Florestas Tropicais', duracao: '50 min', descricao: 'As ricas florestas tropicais e sua fauna exuberante sob pressão.' },
        ],
        usuario: adminUser._id,
      },
    ];

    await Content.insertMany(conteudosIniciais);
    console.log('🎬 Conteúdos iniciais inseridos com sucesso (Séries, Animes, Filmes e Documentários)!');

    await mongoose.disconnect();
    console.log('✅ Seed finalizado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante a execução do seed:', error);
    process.exit(1);
  }
};

seed();
