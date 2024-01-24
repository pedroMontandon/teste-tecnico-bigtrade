import { Request, Router, Response } from 'express';
import PostController from '../controllers/PostController';
import PostValidations from '../middlewares/PostValidations';
import TokenValidations from '../middlewares/TokenValidations';

const postController = new PostController();
const router = Router();

router.put('/:id', PostValidations.validateCreate, PostValidations.validateId, TokenValidations.validateToken, (req: Request, res: Response) => postController.update(req, res));
router.delete('/:id', PostValidations.validateId, TokenValidations.validateToken, (req: Request, res: Response) => postController.delete(req, res));
router.post('/', PostValidations.validateCreate, TokenValidations.validateToken, (req: Request, res: Response) => postController.create(req, res));
router.get('/:id', PostValidations.validateId, (req: Request, res: Response) => postController.findById(req, res));
router.get('/', (_req: Request, res: Response) => postController.findAll(_req, res));

export default router;