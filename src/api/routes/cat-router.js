import express from 'express';
import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';
import multer from 'multer';
import {
  authenticateToken,
  createThumbnail,
} from '../../middlewares/middlewares.js';

const catRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let extension;
    if (file.mimetype === 'image/png') {
      extension = '.png';
    }
    cb(null, file.originalname + '-' + uniqueSuffix + extension);
  },
});

const upload = multer({storage: storage});

catRouter.route('/')
  .get(getCat)
  .post(authenticateToken, upload.single('filename'), createThumbnail, postCat);

catRouter.route('/:id')
  .get(getCatById)
  .put(putCat)
  .delete(deleteCat);

export default catRouter;
