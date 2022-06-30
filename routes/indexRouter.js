const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const passport = require('../DB/configPassport');
const log4js = require('../utils/logs');
const logConsole = log4js.getLogger('consola');
const logError = log4js.getLogger('error');
require('dotenv').config();

router.use(cookieParser());
router.use(session({
  store: connectMongo.create({
    mongoUrl: `mongodb+srv://${process.env.USERNAMEDB}:${process.env.PASSWORDDB}@cluster0.33nzl.mongodb.net/${process.env.SESSIONSDB}?retryWrites=true&w=majority`,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 600
  }),
  secret: `${process.env.SECRETDB}`,
  resave: true,
  saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());


// Ruta--------------------------------------------------------------------
router.get('/',(req, res) => {
  if(req.isAuthenticated()){
    logConsole.info('El usuario ya estaba logueado');
    res.render('pages/index',{nombre : req.session.passport.user});
  }else{
    logError.error('El usuario no estaba logueado, sin acceso a esta ruta');
    res.redirect('/login');
  }
});

module.exports = router;