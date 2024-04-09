import {
  listAllUsers,
  findUserById,
  addUser,
  removeUser,
} from '../models/user-model.js';

const getUser = (req, res) => {
  res.json(listAllUsers());
}

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
}

const postUser = (req, res) => {
  const result = addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
}

const putUser = (req, res) => {
  updateUser(req.body, req.params.id);
  res.status(200)
  res.json({message: 'User: ' + req.params.id + ' updated.'});

}

const deleteUser = (req, res) => {
  removeUser(req.params.id);
  res.status(200);
  res.json({message: 'User: ' + req.params.id + ' removed.'});
}

export {getUser, getUserById, postUser, putUser, deleteUser}
