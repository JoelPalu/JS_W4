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

const addCat = (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const newId = catItems[0].cat_id + 1;
  catItems.unshift({cat_id: newId, cat_name, weight, owner, filename, birthdate});
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