import {
  addCat,
  findCatById,
  listAllCats,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

const getCat = async (req, res) => {
  res.json(await listAllCats());
};

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};


const sanitizeCatObject = (cat) => {
  for (const key in cat) {
    if (cat[key] === undefined) {
      cat[key] = null;
    }
  }
  return cat;
};

const postCat = async (req, res) => {
  const sanitizedBody = sanitizeCatObject(req.body);
  const result = await addCat(sanitizedBody, req.file);
  console.log('result', req.body)
  console.log('file', req.file)
  if (result.cat_id) {
    res.status(200);
    const cat = await findCatById(result.cat_id);
    res.json({message: 'New cat added.', result: cat});
  } else {
    res.sendStatus(400);
  }
};

const putCat = (req, res) => {
  updateCat(req.body, req.params.id);
  res.status(201);
  res.json({message: 'Cat item id: ' + req.params.id + " updated"});
};

const deleteCat = (req, res) => {
  removeCat(req.params.id);
  res.status(200);
  res.json({message: 'Cat item id: ' + req.params.id + " deleted"});
};

export {getCat, getCatById, postCat, putCat, deleteCat};
