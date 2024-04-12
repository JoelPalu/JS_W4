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
  createThumbnail, validationErrors,
} from '../../middlewares/middlewares.js';
import {body} from 'express-validator';

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
    if (file.mimetype === 'image/jpeg') {
      extension = '.jpg';
    }

    cb(null, file.originalname + '-' + uniqueSuffix + extension);
  },

  fileFilter: (req, file, cb) =>{
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")){
      cb(null, true);
    } else {
    const error = new Error("Only images and videos are supported");
    error.status = 400;
    cb(error);
    }
  }
});

const upload = multer({storage: storage});

catRouter.route('/')
  .get(getCat)
  .post(authenticateToken,
    upload.single('filename'),
    body('cat_name').notEmpty(),
    validationErrors,
    createThumbnail,
    postCat);

catRouter.route('/:id')
  .get(getCatById)
  .put(putCat)
  .delete(deleteCat);

export default catRouter;
