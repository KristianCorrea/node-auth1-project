const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('../users/usersRouter');
const authRouter = require('../auth/authRouter');
const requiresAuth = require('../auth/requiresAuth');
const dbConnection = require('../data/connection');

const server = express();

const sessionConfig = {
  name: 'manky',
  secret: process.env.SESSION_SECRET || 'the secret',
  cookie: {
    maxAge: 1000 * 10,  // 30 seconds in milliseconds 
    secure: process.env.COOKIE_SECURE || false, // use true only over HTTPS (in production)
    httpOnly: true,          // JS code on the client cannot access the cookie 
  },
  resave: false,             // recreate session even if it hasn't changed
  saveUninitialized: true,  // GDPR compliance (turn on cookies on user approval in client)
  store: new KnexSessionStore({
    knex: dbConnection,
    tableName: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 6000,  // delete expired sessions every 10 mins
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig)); //express middleware
server.use('/api/users', requiresAuth, usersRouter);
server.use('/api/auth', authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;