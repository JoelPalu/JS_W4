import {
  addCat,
  findCatById,
  listAllCats,
  updateCat,
  removeCat,
} from '../models/cat-model.js';

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatById = (req, res) => {
  const cat = findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = (req, res) => {
  const result = addCat(req.body);
  console.log('result', req.body)
  if (result.cat_id) {
    res.status(201);
    res.json({message: 'New cat added.', result});
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
