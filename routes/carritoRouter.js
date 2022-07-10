const express = require('express');
const router = express.Router();
const Carrito = require('../controllers/carrito');
const carrito = new Carrito();

router.get('/addCar',async (req, res) => {
    await carrito.createCar();
    console.log('carrito creado con exito');
    res.redirect('/');
});

router.get('/delCar',async (req, res) => {
    await carrito.delCar(1);
    console.log('carrito eliminado con exito');
    res.redirect('/');
});

router.get('/listCar',async (req, res) => {
    const car = await carrito.listCar(1);
    res.send({car:car});
});

router.get('/addProd/:idProduct',async (req, res) => {
    const car = await carrito.listCar(1);
    if(!car){
        await carrito.createCar();
    }
    await carrito.addProdCar(1,req.params.idProduct);
    res.redirect('/');
});

router.get('/delProd/:id',async (req, res) => {
    await carrito.deleteProdCar(1,req.params.id);
    res.redirect('/');
});

module.exports = router;