// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from '../../utils/database.js';


const listAllCats = async () => {
  const [rows] = await promisePool.execute(`
    SELECT cats.*, users.name AS owner_name
    FROM cats
    JOIN users ON cats.owner = users.user_id
  `);

  console.log('rows', rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    `SELECT cats.*, users.name AS owner_name
    FROM cats
    JOIN users ON cats.owner = users.user_id
    WHERE cat_id = ?
  `, [id]);

  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const findCatByOwner = async (id) => {
  const [rows] = await promisePool.execute(
    `SELECT *
    FROM cats
    WHERE owner = ?
  `, [id]);

  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows;

}

const addCat = async (cat, file, user) => {
  console.log('cat', cat);
  cat = {
    cat_name: cat.cat_name !== undefined ? cat.cat_name : null,
    weight: cat.weight !== undefined ? cat.weight : null,
    owner: cat.owner !== undefined ? cat.owner : null,
    filename: file.filename !== undefined ? file.filename : null,
    birthdate: cat.birthdate !== undefined ? cat.birthdate : null
  };

  if (user.role !== 'admin') {
    cat.owner = user.user_id;
  }else if (cat.owner === null) {
    cat.owner = user.user_id;
  }

  console.log('cat', cat.cat_name, cat.weight, cat.owner, cat.filename, cat.birthdate);
  const sql = `INSERT INTO cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [cat.cat_name, cat.weight, cat.owner, cat.filename, cat.birthdate];
  const rows = await promisePool.execute(sql, params);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {cat_id: rows[0].insertId};
};

const putOwner = async (cat, tcat, user) => {
  if (tcat.owner !== user.user_id && user.role !== 'admin') {
    return cat;
  }else{
    cat.owner = Number(user.user_id);
    return cat;
  }
};

const modifyCat = async (cat, id, user) => {
  const tcat = await findCatById(id);
  cat = await putOwner(cat, tcat, user);
  console.log('cat', cat);

  let sql = promisePool.format(
    `UPDATE cats SET ? WHERE cat_id = ?`,
    [cat, id] // use the filtered updateProperties object
  );

  if (user.role === 'admin') {
    sql = promisePool.format(
      `UPDATE cats SET ? WHERE cat_id = ?`,
      [cat, id]);
  }

  const rows = await promisePool.execute(sql);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};

const removeCat = async (id, user) => {
  let sql = promisePool.format(
    `DELETE FROM cats WHERE cat_id = ? AND owner = ?`,
    [id, user.user_id]
  );
  if (user.role === 'admin') {
    sql = promisePool.format(`DELETE FROM cats WHERE cat_id = ?`, [id]);
  }

  const [rows] = await promisePool.execute(sql);
  console.log('rows', rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};

export {listAllCats, findCatById, findCatByOwner, addCat, modifyCat, removeCat};
/**
/*
// mock data
const catItems = [
  {
    cat_id: 9592,
    cat_name: 'Frank',
    weight: 11,
    owner: 3609,
    filename: 'f3dbafakjsdfhg4',
    birthdate: '2021-10-12',
  },
  {
    cat_id: 9590,
    cat_name: 'Mittens',
    weight: 8,
    owner: 3602,
    filename: 'f3dasdfkjsdfhgasdf',
    birthdate: '2021-10-12',
  },
];

const listAllCats = () => {
  return catItems;
};

const findCatById = (id) => {
  console.log('id', id);
  return catItems.find((item) => item.cat_id == id);
};

const addCat = (cat, file) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const newId = catItems[0].cat_id + 1;
  catItems.unshift({cat_id: newId, cat_name, weight, owner, filename, birthdate, file});
  return {cat_id: newId};
};

const updateCat = (cat, id) => {
  const tcat = findCatById(id);
  const {cat_id, cat_name, weight, owner, filename, birthdate} = cat;
  const index = catItems.findIndex((item) => item.cat_id == tcat.cat_id);

  Object.keys(cat).forEach((key) => {
    if (cat[key] !== null) {
      catItems[index][key] = cat[key];
    }
  });
};

const removeCat = (id) => {
const index = catItems.findIndex((item) => item.cat_id == id);
  catItems.splice(index, 1);
}

export {listAllCats, findCatById, addCat, updateCat, removeCat};
*/
