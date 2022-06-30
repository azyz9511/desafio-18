const express = require('express');
const router = express.Router();
const cpus = require('os').cpus().length;
const log4js = require('../utils/logs');
const logConsole = log4js.getLogger('consola');

router.get('/', (req, res) => {

    logConsole.info('ruta de informacion');
    res.render('pages/info',{cpus});
});

module.exports = router;