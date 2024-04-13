import express from 'express';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser
} from '../controllers/user-controller.js';
import multer from 'multer';
import {storage} from '../multer.js';
import {
  authenticateToken,
  createThumbnail,
} from '../../middlewares/middlewares.js';

const userRouter = express.Router();

const upload = multer({storage: storage});

userRouter.route('/').get(getUser).post(upload.single('file'),createThumbnail, postUser);

userRouter.route('/:id').get(getUserById).put(authenticateToken, putUser).delete(authenticateToken, deleteUser);

export default userRouter;
