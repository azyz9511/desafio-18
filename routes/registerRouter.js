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
const multer = require('multer');
const mimeTypes = require('mime-types');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/img')
  },
  filename : (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.' + mimeTypes.extension(file.mimetype));
  }
});
const upload = multer({storage : storage});

router.use(cookieParser());
router.use(session({
  store: connectMongo.create({
    mongoUrl: `mongodb+srv://${process.env.USERNAMEDB}:${process.env.PASSWORDDB}@proyectofinal.3xa4amn.mongodb.net/${process.env.SESSIONSDB}?retryWrites=true&w=majority`,
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 600
  }),
  secret: `${process.env.SECRETDB}`,
  resave: true,
  saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());


// Rutas--------------------------------------------------------------------------------------------
router.get('/',(req, res) => {
  if(req.isAuthenticated()){
    logConsole.info('El usuario si estaba logueado');
    res.redirect('/')
  }else{
    logError.error('El usuario no estaba logueado');
    res.render('pages/register');
  }
});

router.get('/error',(req, res) => {
  logError.error('Ah ocurrido un error');
  res.render('pages/registerError');
});

router.get('/exito',(req, res) => {
  logConsole.info('Usuario registrado con exito');
  res.render('pages/registerExito');
});

router.get('/logout',(req, res) => {
  req.logout( err => {
    if (err) { 
      console.log(err);
    }
    res.redirect('/register/exito');
  });
});

router.post('/',upload.single('avatar'),passport.authenticate('registro',{
  successRedirect: '/register/logout',
  failureRedirect: '/register/error'
}))

module.exports = router;