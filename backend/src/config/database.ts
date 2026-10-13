import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/atividadedb';

  try {
    await mongoose.connect(mongoUri);
    console.log(`✅ Conectado com sucesso ao MongoDB: ${mongoUri}`);
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    console.error('💡 Dica: Verifique se o serviço do MongoDB está em execução localmente ou configure sua string de conexão do MongoDB Atlas no arquivo .env (MONGO_URI=...)');
    process.exit(1);
  }
};
