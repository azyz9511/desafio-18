const express = require('express');
const router = express.Router();
const Carrito = require('../controllers/carrito');
const carrito = new Carrito();
const {newOrderSms} = require('../utils/twilio');

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

router.get('/finCar/:nombre/:email/:numtel', async (req, res) => {
    try{
        const nombre = req.params.nombre;
        const email = req.params.email;
        const numTel = req.params.numtel;

        const resEmail = await carrito.carFin(nombre,email);
        console.log(resEmail);

        const resSms = await newOrderSms(numTel);
        console.log(resSms);

        res.render('pages/pedidoExito');
    }catch(e){
        console.log(e);
    }
})

module.exports = router;