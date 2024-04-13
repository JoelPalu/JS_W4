import {
  listAllUsers,
  findUserById,
  addUser,
  removeUser,
  updateUser,
} from '../models/user-model.js';
import bcrypt from 'bcrypt';
import promisePool from '../../utils/database.js';

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

const postUser = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const result = addUser(req.body);

    if (!result){
      const error = new Error('Invalid or missing fields');
      error.status = 400;
      next(error);
      return;
    }

    if (result.user_id) {
      res.status(201);
      res.json({message: 'New user added.', result});
      const sql = 'INSERT INTO users (name, username, email, role, password) VALUES (?, ?, ?, ?, ?)';
      const params = [req.body.name, req.body.username, req.body.email, req.body.role, req.body.password];
      promisePool.execute(sql, params);
    } else {
      res.sendStatus(400).json({message: 'Failed to add user. Check your input data.'});;
    }

  } catch (error) {
    res.status(500).json({message: 'Server error', error: error.message});
}

const putUser = async (req, res) => {
  await updateUser(req.body, req.params.id, res.locals.user);
  res.status(200)
  res.json({message: 'User: ' + req.params.id + ' updated.'});

}

const deleteUser = async (req, res) => {
  const response = await removeUser(req.params.id, res.locals.user);
  res.status(200);
  res.json({'response': response.message});
}

export {getUser, getUserById, postUser, putUser, deleteUser};
