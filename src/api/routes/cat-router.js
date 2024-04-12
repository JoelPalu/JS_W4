import express from 'express';
import {
  getCat,
  getCatById,
  getCatByOwner,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';

import {
  authenticateToken,
  createThumbnail,
} from '../../middlewares/middlewares.js';
import multer from 'multer';
import {storage} from '../multer.js';

const catRouter = express.Router();
const upload = multer({storage: storage});

catRouter.route('/')
  .get(getCat)
  .post(authenticateToken, upload.single('filename'), createThumbnail, postCat);

catRouter.route('/:id')
  .get(getCatById)
  .put(authenticateToken, putCat)
  .delete(deleteCat);

catRouter.route('/user/:id').get(getCatByOwner);

export default catRouter;
