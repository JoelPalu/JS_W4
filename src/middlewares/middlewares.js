import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authenticateToken = (req, res, next) => {
  console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token', token);
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send({message: 'invalid token'});
  }
};

export {authenticateToken};



const  createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next()
    return;
  }

  const filepath = req.file.path
  const thumbnailPath = filepath + "_thumb.png";
  await sharp(filepath)
    .resize(160, 160)
    .toFormat("png")
    .toFile(thumbnailPath);

  console.log(req.file);
  next()
}

export {createThumbnail}