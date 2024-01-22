import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes';
import ErrorMiddleware from './middlewares/ErrorMiddleware';

dotenv.config();

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.setupDatabase();
    this.app.use(ErrorMiddleware.handleErrors);
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };
    this.app.use(express.json());
    this.app.use(accessControl);
  }

  private routes(): void {
    this.app.use(router);
  }

  private async setupDatabase(): Promise<void> {
    const MONGO_DB = process.env.MONGO_DB;
    const MONGO_USERNAME = process.env.MONGO_USERNAME;
    const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
    const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
    const MONGO_PORT = process.env.MONGO_PORT;

    const dbURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

    try {
      await mongoose.connect(dbURL, {});
      console.log('Conexão com o MongoDB estabelecida com sucesso!');
    } catch (error) {
      console.error('Erro na conexão com o MongoDB:', error);
      process.exit(1); // Encerra o aplicativo em caso de falha na conexão
    }
  }

  public start(PORT: string | number) {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export default App;
