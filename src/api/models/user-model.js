import promisePool from '../../utils/database.js';

const userItems = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
{
    user_id: 3602,
    name: 'Jane Doe',
    username: 'janedoe',
    email: 'jane@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3601,
    name: 'Admin',
    username: 'admin',
    email: 'adminno@metropolia.fi',
    role: 'admin',
    password: 'password',
  },
];

const listAllUsers = () => {
  return userItems;
};

const findUserById = (id) => {
  return userItems.find((item) => item.user_id == id);
};

const addUser = (user) => {
  const {name, username, email, role, password} = user;
  const newId = userItems[0].user_id + 1;
  userItems.unshift({user_id: newId, name, username, email, role, password});
  return {user_id: newId};
};

const updateUser = (user, id) => {
  const tuser = findUserById(id);
  const {user_id, name, username, email, role, password} = user;
  const index = userItems.findIndex((item) => item.user_id == tuser.user_id);

  Object.keys(user).forEach((key) => {
    if (user[key] !== null) {
      userItems[index][key] = user[key];
    }
  });
}

const removeUser = (id) => {
  const index = userItems.findIndex((item) => item.user_id == id);
  userItems.splice(index, 1);

}

const getUserByUsername = async (username) =>{
  const sql =  'SELECT * ' +
                      'FROM users ' +
                      'WHERE username = ?';
  const [rows] = await promisePool.execute(sql, [username]);
  if (rows.length === 0){
    return false;
  }
  return rows[0];
}

export {listAllUsers, findUserById, addUser, updateUser, removeUser, getUserByUsername};
