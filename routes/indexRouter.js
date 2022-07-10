const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const passport = require('../DB/configPassport');
const log4js = require('../utils/logs');
const logConsole = log4js.getLogger('consola');
const logError = log4js.getLogger('error');
const Usuario = require('../controllers/usuarios');
const usuario = new Usuario();
const Producto = require('../controllers/productos');
const producto = new Producto();
const Car = require('../controllers/carrito');
const car = new Car();
require('dotenv').config();


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


// Ruta--------------------------------------------------------------------
router.get('/',async (req, res) => {
  if(req.isAuthenticated()){
    logConsole.info('El usuario ya estaba logueado');
    const email = req.session.passport.user;
    const user = await usuario.findUser(email);
    const products = await producto.getProducts();
    const carrito = await car.listCar(1);
    res.render('pages/index',{user: user,products: products,carrito: carrito});
  }else{
    logError.error('El usuario no estaba logueado, sin acceso a esta ruta');
    res.redirect('/login');
  }
});

module.exports = router;