const bcryptjs = require('bcryptjs');
const router = require('express').Router();

const Users = require('../users/usersModel');

router.post('/register', (req,res) => {
  const { username, password } = req.body;
  const rehashes = 8;
  const hash = bcryptjs.hashSync(password, rehashes);

  Users.add({ username, password: hash })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err))
});

router.post('/login', (req,res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if(user && bcryptjs.compareSync(password, user.password)) {
        req.session.user = { id: user.id, username: user.username };
        res.status(200).json({ message: `Welcome ${user.username}`, session: req.session.user });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});


module.exports = router;