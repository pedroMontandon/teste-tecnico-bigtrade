import { Request, Router, Response } from 'express';
import UserController from '../controllers/UserController';
import UserValidations from '../middlewares/UserValidations';

const userController = new UserController();
const router = Router();

router.post('/', UserValidations.validateSignUp, (req: Request, res: Response) => userController.create(req, res));
router.put('/:id', UserValidations.validateSignUp, (req: Request, res: Response) => userController.update(req, res));
router.get('/:id', (req: Request, res: Response) => userController.findById(req, res));
router.delete('/:id', (req: Request, res: Response) => userController.delete(req, res));

export default router;