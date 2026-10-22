import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

const run = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/atividadedb');
  
  // Garantir que admin@email.com existe com role admin e senha 123456
  let admin = await User.findOne({ email: 'admin@email.com' });
  if (!admin) {
    admin = new User({
      nome: 'Administrador Tech',
      email: 'admin@email.com',
      senha: '123456',
      role: 'admin',
    });
    await admin.save();
  } else {
    admin.role = 'admin';
    admin.senha = '123456';
    await admin.save();
  }

  // Garantir que emerson@email.com também existe como admin e senha 123456
  let emerson = await User.findOne({ email: 'emerson@email.com' });
  if (!emerson) {
    emerson = new User({
      nome: 'Emerson',
      email: 'emerson@email.com',
      senha: '123456',
      role: 'admin',
    });
    await emerson.save();
  } else {
    emerson.role = 'admin';
    emerson.senha = '123456';
    await emerson.save();
  }

  const allUsers = await User.find({});
  console.log('USUÁRIOS ATUAIS NO BANCO:', allUsers.map(u => ({ nome: u.nome, email: u.email, role: u.role })));

  await mongoose.disconnect();
};

run().catch(console.error);
