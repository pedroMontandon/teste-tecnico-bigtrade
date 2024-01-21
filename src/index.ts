import mongoose from 'mongoose';
import appInstance from './App';
import dotenv from 'dotenv';
import initializeDatabase from './utils/initializeDatabase';

dotenv.config();

const PORT = process.env.PORT || 3000;

const MONGO_DB = process.env.MONGO_DB;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_PORT = process.env.MONGO_PORT;

const dbURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
appInstance.start(PORT);

mongoose.connect(dbURL, {});

const conexao = mongoose.connection;
 
conexao.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
conexao.once('open', () => {
  console.log('Conexão com o MongoDB estabelecida com sucesso!');
});

const migrate = async () => {
  try {
    await initializeDatabase();
    console.log('Dados populados com sucesso!');
  } catch (err) {
    console.error('Erro ao popular dados no MongoDB:', err);
  }
}
migrate();
