// const dbConn = require('../config/db');
var jwt = require('jsonwebtoken');
const md5 = require('md5');
const assert = require('assert');
const Mongo = require('mongodb');
// Connection URL
const mongoUrl = 'mongodb://localhost:27017';
// Database Name
const mongoDBName = 'angelDB';
const secret = 'mysecret';

const authController = {};

// login del user
authController.find = (req, res) => {
    Mongo.MongoClient.connect(mongoUrl, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(mongoDBName);
        let hola;
        //comprobar que es correcto el user con su pass
        const query = db.collection("users").find({
            username: req.body.username,
            password: md5(req.body.password)
        });
        // console.log(query);

        //crear el token
        query.toArray().then(documents => {
            console.log(documents);
            if (documents.length > 0) {
                console.log(documents[0]);
                var token = jwt.sign(
                    {
                        _id: documents[0]._id,
                        username: documents[0].username,
                        isAdmin: documents[0].isAdmin,
                        email: documents[0].email
                    },
                    secret//,
                    // {
                    //     expiresIn: 3600 
                    // }
                );
                // res.send("Checkeo Correcto")
                console.log(token)
                res.send(token);
            } else {
                res.status(400).send("Invalid credentials");
            }
        });

        client.close();
    });
};

//listar los users con sus names
authController.list = (_req, res) => {
    Mongo.MongoClient.connect(mongoUrl, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(mongoDBName);

        const query = db.collection("users").find({}); //, { projection: { _id: 0, username: 1, email: 1} });

        query.toArray().then(documents => {
            if (err) throw err;
            const result = documents.map(user => ({
                _id: user._id,
                username: user.username,
                email: user.email
            }));
            res.send(result);
        });
        client.close();
    });
};

//listar los users con sus names y email porque eres admin
authController.listAdmin = (_req, res) => {
    Mongo.MongoClient.connect(mongoUrl, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(mongoDBName);

        const query = db.collection("users").find({});

        query.toArray().then(documents => {
            if (err) throw err;
            const result = documents.map(user => ({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            }));
            res.send(result);
        });
        client.close();
    });
};



authController.listOne = (req, res) => {
    Mongo.MongoClient.connect(mongoUrl, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const data = Mongo.ObjectID(req.params.id);
        const db = client.db(mongoDBName);

        const query = db.collection("users").findOne({ _id: data });

        query.then(document => {
            if (err) throw err;
            res.send(document);
        });
        client.close();
    });
};




authController.add = (req, res) => {
    try {
        // let tengoPermiso = false;
        // if (req.headers.authorization) {
        //     const token = req.headers.authorization.replace('Bearer ', '');
        //     console.log(token);
        //     // const id = Mongo.ObjectID(req.params.id);
        //     // console.log(id);
        //     if (token == '' || !token) {
        //         res.status(400).send('El token no es valido');

        //     } else {
        //         let decoded = jwt.verify(token, "mysecret");
        //         console.log(decoded);
        //         const id = Mongo.ObjectID(req.params.id);
        //         console.log(id);
        //         if (decoded._id == id || decoded.isAdmin) {
        //             tengoPermiso = true;
        //         } else {
        //             res.status(400).send('No tienes permiso para editar');
        //         }
        //     }
        // }
        
        Mongo.MongoClient.connect(mongoUrl, (err, client) => {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const add = req.body;
            console.log(add);
            const db = client.db(mongoDBName);
            var user = {
                ...(add.username != "" && { username: add.username }),
                ...(add.password != "" && { password: md5(add.password) }),
                ...(add.email != "" && { email: add.email }),
                isAdmin : false
            }
            // if (tengoPermiso) {
            //     user = {
            //         user,
            //         ...(add.isAdmin !== null && { isAdmin: add.isAdmin })
            //     }
            // }
            ///************************Creo que hay que cambiar esta linea******************************** *//
            //****************// db.collection("users").insertOne( user //************************** */
            db.collection("users").insertOne( user 
            ).then(
                res.send('Añadido')
            ).catch(err => {
                res.status(400).send('Ha habido algun error ' + err);
            })
            client.close();
        })
    } catch (error) {
        console.log(error);
        res.status(400).send('Error en la conexionDB ' + error);
    }
}

authController.edit = (req, res) => {

    const id = Mongo.ObjectID(req.params.id);
    console.log(id);
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        let decoded = jwt.verify(token, "mysecret");
        console.log(decoded._id);
        if (decoded._id == id || decoded.isAdmin) {
            Mongo.MongoClient.connect(mongoUrl, (err, client) => {
                assert.equal(null, err);

                const update = req.body;
                console.log(update);

                const db = client.db(mongoDBName);
                db.collection("users").updateOne({ _id: id }, {
                    $set: {
                        ...(update.username != "" && { username: update.username }),
                        ...(update.password != "" && { password: md5(update.password) }),
                        ...(update.isAdmin != null && { isAdmin: update.isAdmin }),
                        ...(update.email != "" && { email: update.email })
                    }
                }
                ).then(
                    res.send('Editado')
                ).catch(err => {
                    res.status(400).send('Ha habido algun error ' + err);
                })
                console.log("pase por aqui")
                client.close();
            })
        } else {
            res.status(400).send('No tienes permiso para editar');
        }
    } catch (error) {
        console.log(error);
        res.status(400).send('El token no es válido o no existe o fallo en conexionBD, ' + error);
    }
}


authController.delete = (req, res) => {

    try {
        const id = Mongo.ObjectID(req.params.id);
        console.log(id);

        const token = req.headers.authorization.replace('Bearer ', '');
        console.log(token);

        let decoded = jwt.verify(token, "mysecret");
        console.log(decoded._id);

        if (decoded._id == id || decoded.isAdmin) {
            Mongo.MongoClient.connect(mongoUrl, (err, client) => {
                assert.equal(null, err);
                console.log("Connected successfully to server");

                const db = client.db(mongoDBName);

                db.collection("users").remove({ _id: id })
                    .then(
                        res.send('Borrado')
                    ).catch(err => {
                        res.status(400).send('Ha habido algun error ' + err);
                    });
                client.close();
            });
        } else {
            res.status(400).send('No tienes permiso para borrar');
        }
    } catch (error) {
        console.log(error);
        res.status(400).send('El token no es válido o la conexion');
    }
};

module.exports = authController;