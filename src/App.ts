import express, { RequestHandler } from 'express';
import router from './routes';
import ErrorMiddleware from './middlewares/ErrorMiddleware';
require('dotenv').config();

class App {
    public app: express.Express;   
    
    constructor() {
      this.app = express();
      this.config();
      this.routes();
      this.app.use(ErrorMiddleware.handleErrors);
    }
  
    private config(): void {
      const accessControl: express.RequestHandler = (_req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
        res.header('Access-Control-Allow-Headers', '*');
        next();
      }
      this.app.use(express.json());
      this.app.use(accessControl);
    }
    
    private routes(): void {
      this.app.use(router);
    }

    private errorHandling(): void {
      this.app.use(ErrorMiddleware.handleErrors);
    }
  
    public start(PORT: string | number) {
      this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
    }
  }
  
const appInstance = new App();
export default appInstance;