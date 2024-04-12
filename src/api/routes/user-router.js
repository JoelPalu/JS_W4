import express from 'express';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser
} from '../controllers/user-controller.js';
import multer from 'multer';

const userRouter = express.Router();

const upload = multer();

userRouter.route('/').get(getUser).post(upload.single('file'), postUser);

userRouter.route('/:id').get(getUserById).put(putUser).delete(deleteUser);

export default userRouter;
