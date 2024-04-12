import {
  listAllUsers,
  findUserById,
  addUser,
  removeUser, updateUser,
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
    const result = await addUser(req.body);
    if (result.user_id) {
      const sql = 'INSERT INTO users (name, username, email, role, password) VALUES (?, ?, ?, ?, ?)';
      const params = [req.body.name, req.body.username, req.body.email, req.body.role, req.body.password];
      await promisePool.execute(sql, params);
      res.status(201);
      res.json({message: 'New user added.', result});
    } else {
      res.status(400).json({message: 'Failed to add user. Check your input data.'});
    }
  } catch (error) {
    res.status(500).json({message: 'Server error', error: error.message});
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
