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
  createThumbnail, validationErrors,
} from '../../middlewares/middlewares.js';
import {body} from 'express-validator';
import multer from 'multer';

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
    body('weight').notEmpty(),
    body('birthdate').isDate(),
    body('owner').isAlphanumeric(),
    validationErrors,
    createThumbnail,
    postCat);

catRouter.route('/:id')
  .get(
    validationErrors,
    getCatById)
  .put(authenticateToken,
    body('cat_name').optional().notEmpty(),
    body('weight').optional().notEmpty(),
    body('birthdate').optional().isDate(),
    body('owner').optional().isAlphanumeric(),
    validationErrors,
    putCat)
  .delete(authenticateToken,
    validationErrors,
    deleteCat);

catRouter.route('/user/:id').get(
  validationErrors,
  getCatByOwner);

export default catRouter;
