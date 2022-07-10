const express = require('express');
const router = express.Router();
const Producto = require('../controllers/productos');
const producto = new Producto();

router.post('/',async (req, res) => {
    await producto.saveProduct(req.body);
    console.log('producto guardado correctamente');
    res.redirect('/');
});

router.get('/:id',async (req, res) => {
    const prodById = await producto.getProdById(req.params.id);
    console.log('producto guardado correctamente');
    res.send(prodById);
});

module.exports = router;