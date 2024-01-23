import { Request, Router, Response } from 'express';
import UserController from '../controllers/UserController';
import UserValidations from '../middlewares/UserValidations';
import TokenValidations from '../middlewares/TokenValidations';

const userController = new UserController();
const router = Router();

router.put('/:id', UserValidations.validateCreate, UserValidations.validateId, TokenValidations.validateToken, (req: Request, res: Response) => userController.update(req, res));
router.get('/:id', UserValidations.validateId, (req: Request, res: Response) => userController.findById(req, res));
router.delete('/:id', UserValidations.validateId, TokenValidations.validateToken, (req: Request, res: Response) => userController.delete(req, res));
router.post('/login', UserValidations.validateLogin, (req: Request, res: Response) => userController.login(req, res));
router.post('/', UserValidations.validateCreate, (req: Request, res: Response) => userController.create(req, res));

export default router;