import { Request, Router, Response } from 'express';
import UserController from '../controllers/UserController';
import UserValidations from '../middlewares/UserValidations';

const userController = new UserController();
const router = Router();

router.put('/:id', UserValidations.validateSignUp, UserValidations.validateId, (req: Request, res: Response) => userController.update(req, res));
router.get('/:id', UserValidations.validateId, (req: Request, res: Response) => userController.findById(req, res));
router.delete('/:id', UserValidations.validateId, (req: Request, res: Response) => userController.delete(req, res));
router.post('/', UserValidations.validateSignUp, (req: Request, res: Response) => userController.create(req, res));

export default router;