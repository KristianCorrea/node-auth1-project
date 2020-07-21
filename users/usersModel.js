const db = require('../data/connection');

function find() {
  return db('users')
    .select('id', 'username')
    .orderBy('id')
};

function findBy(filter) {
  return db('users').where(filter).orderBy('id');
}

function add(user) {
  return db('users')
    .insert(user, 'id')
    .then(ids => {
      return findById(ids[0])
    })
};

function findById(id) {
  return db('users').where({ id }).first();
};

module.exports = { 
  add,
  find,
  findBy,
  findById,
};