import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupControler from './app/controllers/MeetupController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/users/:id', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);
routes.post('/meetups', MeetupControler.store);
routes.patch('/meetups/:id', MeetupControler.update);

export default routes;
