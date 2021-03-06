import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupControler from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/users/:id', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);

routes.get('/meetups', MeetupControler.index);
routes.post('/meetups', MeetupControler.store);
routes.patch('/meetups/:id', MeetupControler.update);
routes.delete('/meetups/:id', MeetupControler.delete);

routes.post('/meetups/:meetupId/subscriptions', SubscriptionController.store);

export default routes;
