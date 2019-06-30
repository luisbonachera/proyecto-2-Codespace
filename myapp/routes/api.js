var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
let authController = require('../controllers/authController');
let seriesController = require('../controllers/seriesController');
//te crea el token
router.post('/auth', authController.find);
//lita el usuario id
router.get('/users/:id', authController.listOne);
//listar usuarios 
router.get('/users', (req, res) => {
    // const token = localStorage.getItem('token');
    // token.authorization;
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        // console.log(token);
        let very5 = jwt.verify(token, "mysecret");
        //también podemos hacer un if con un throw para que nos devuelva un error que nosotros le especifiquemos
        (very5.isAdmin) ? authController.listAdmin(req, res) : authController.list(req, res);
    } catch (error) {
        res.status(400).send('El token no es válido o no hay token');
    }
});
//añadir un usuario
router.post('/users', authController.add);
//editar un usuario
router.put('/users/:id', authController.edit);
//borrar un usuario
router.delete('/users/:id', authController.delete);


 
//lista las series
router.get('/series', seriesController.listAdmin);//(req, res) => {
    // try {
    //     const token = req.headers.authorization.replace('Bearer ', '');
    //     let very5 = jwt.verify(token, "mysecret");
    //     seriesController.listAdmin(req, res);
    //     // (very5.isAdmin) ? seriesController.listAdmin(req, res) : seriesController.list(req, res);
    // } catch (error) {
    //     res.status(400).send('El token no es válido o no hay token');
    // }
// });
//lita una serie id
router.get('/series/:idS/:idU', seriesController.listOne);
//listar las series del User IdU
router.get('/series/:idU', seriesController.listSeriesUser);
//añadir una serie
router.post('/series', seriesController.add);
//editar una serie idU es el id Usuario que creo la pelicula
router.put('/series/edit/:idS/:idU', seriesController.edit);
//borrar una serie solo puede hacerlo el Admin
router.delete('/series/:id', seriesController.delete);
module.exports = router;