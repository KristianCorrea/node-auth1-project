
exports.seed = function(knex) {
  return knex('users')
    .then(function () {
      return knex('users').insert([
        {
          username: 'John',
          password: 'pass'
        },
        {
          username: 'Jane',
          password: 'word'
        }
      ]);
    });
};
