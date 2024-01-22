import App from './App';
import dotenv from 'dotenv';
import initializeDatabase from './utils/initializeDatabase';

dotenv.config();

const PORT = process.env.PORT || 3000;

const appInstance = new App();
appInstance.start(PORT);

const migrate = async () => {
  try {
    await initializeDatabase();
    console.log('Dados populados com sucesso!');
  } catch (err) {
    console.error('Erro ao popular dados no MongoDB:', err);
  }
};

migrate();
