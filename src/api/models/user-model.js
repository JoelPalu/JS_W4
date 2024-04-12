import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM users');
  console.log('rows', rows);
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute('SELECT * FROM users WHERE user_id = ?', [id]);
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (user) => {
  user = {
    name: user.name !== undefined ? user.name : null,
    username: user.username !== undefined ? user.username : null,
    email: user.email !== undefined ? user.email : null,
    role: user.role !== undefined ? user.role : null,
    password: user.password !== undefined ? user.password : null
  };
  const {name, username, email, role, password} = user;
  const sql = `INSERT INTO users (name, username, email, role, password)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [name, username, email, role, password];
  const [result] = await promisePool.execute(sql, params);

  const [rows] = await promisePool.execute('SELECT * FROM users WHERE user_id = ?', [result.insertId]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const updateUser = async (user, id) => {

  const tuser = findUserById(id);
  const index = userItems.findIndex((item) => item.user_id == tuser.user_id);

  Object.keys(user).forEach((key) => {
    if (user[key] !== null) {
      userItems[index][key] = user[key];
    }
  });

  let sql = promisePool.format(
    `UPDATE users SET ? WHERE user_id = ?`,
    [user, id]
  );

  const rows = await promisePool.execute(sql);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
}

const removeUser = async (id) => {
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
