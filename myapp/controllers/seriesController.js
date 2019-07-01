// const dbConn = require('../config/db');
const jwt = require('jsonwebtoken');
// const md5 = require('md5'); //mirar si se usa///////////////////////////////
const assert = require('assert');
const Mongo = require('mongodb');
// Connection URL
const mongoUrl = 'mongodb://localhost:27017';
// Database Name
const mongoDBName = 'angelDB';
// const secret = 'mysecret'; // mirar si se usa///////////////////////////////

const seriesController = {};

// lita el usuario id
seriesController.listOne = (req, res) => {
  try {
    console.log('tontoOne');
    // console.log(req.headers);
    const token = req.headers.authorization.replace('Bearer ', '');
    console.log(token);
    try {
      const decoded = jwt.verify(token, 'mysecret');
      console.log(decoded);
      const _idS = Mongo.ObjectID(req.params.idS);
      const _idU = Mongo.ObjectID(req.params.idU);
      console.log(_idS);
      console.log(_idU);
      if (decoded.isAdmin || decoded._id == _idU) {
        console.log('entra');
        try {
          Mongo.MongoClient.connect(mongoUrl, (err, client) => {
            assert.equal(null, err);
            console.log('Connected successfully to server');
            const db = client.db(mongoDBName);


            let serie;
            const query = db.collection('series').findOne({ _id: _idS });
            query.then((document) => {
              console.log(document);
              serie = document;

              const _idU = Mongo.ObjectID(serie.user);
              let user;
              const query2 = db.collection('users').findOne({ _id: _idU });
              query2.then((document2) => {
                console.log('query2');
                console.log(document);
                user = document2;
                serie.user = user;
                console.log(serie);
                res.send(serie);
              }).catch((err) => {
                res.status(400).send(`Fallo en la 2a consulta con DB, ${ err}`);
              });
              client.close();
            }).catch((err) => {
              res.status(400).send(`Fallo en la 1a consulta con DB, ${err}`);
            });
          });
        } catch (err) {
          res.status(400).send(`Eror en la conexionDB, ${err}`);
        }
      } else {
        res.status(400).send(`El token no es válido, ${ err}`);
      }
    } catch (err) {
      res.status(400).send(`El token no existe despues, ${err}`);
    }

  } catch (err) {
    res.status(400).send(`El token no existe, ${ err}`);
  }
};

// listar las series del User IdU
seriesController.listSeriesUser = (req, res) => {
  try {
    console.log('tonto');
    console.log(req.headers);
    const token = req.headers.authorization.replace('Bearer ', '');
    console.log(token);
    try {
      const decoded = jwt.verify(token, 'mysecret');
      console.log(decoded);
      // const _idS = Mongo.ObjectID(req.params.idS);
      const _idU = Mongo.ObjectID(req.params.idU);
      // console.log(_idS);
      console.log(_idU);
      if (decoded.isAdmin || decoded._id == _idU) {
        console.log('entra');
        try {
          Mongo.MongoClient.connect(mongoUrl, (err, client) => {
            assert.equal(null, err);
            console.log('Connected successfully to server');
            const db = client.db(mongoDBName);

            let series;

            const query = db.collection('series').find({ user: _idU });
            query.toArray().then((documentsSeries) => {
              // query.then(document => {
              console.log(documentsSeries);
              series = documentsSeries;

              // const _idU = Mongo.ObjectID(series.user);
              let user;
              const query2 = db.collection('users').findOne({ _id: _idU });
              query2.then((documentUSer) => {
                console.log('query2');
                console.log(documentUSer);
                series = series.map(serie => ({ ...serie, user: documentUSer.username }));

                console.log(series);
                res.send(series);
              }).catch((err) => {
                res.status(400).send(`Fallo en la 2a consulta con DB, ${err}`);
              });
              client.close();
            }).catch((err) => {
              res.status(400).send(`Fallo en la 1a consulta con DB, ${err}`);
            });
          });
        } catch (err) {
          res.status(400).send(`Eror en la conexionDB, ${err}`);
        }
      } else {
        res.status(400).send(`El token no es válido, ${err}`);
      }
    } catch (err) {
      res.status(400).send(`El token no existe despues, ${err}`);
    }

  } catch (err) {
    res.status(400).send(`El token no existe, ${err}`);
  }
};

// listar los series
seriesController.listAdmin = (req, res) => {
  try {
    console.log('listAdmin');
    const token = req.headers.authorization.replace('Bearer ', '');
    console.log(token);

    const decoded = jwt.verify(token, 'mysecret');
    console.log(decoded._id);
    if (decoded) {
      console.log('entra');
      try {
        Mongo.MongoClient.connect(mongoUrl, (err, client) => {
          assert.equal(null, err);
          console.log('Connected successfully to server');

          const db = client.db(mongoDBName);

          const query = db.collection('series').aggregate([{
            $lookup: { // like an INNER JOIN
              from: 'users', // users collection
              localField: 'user', // fk specified in 'series'
              foreignField: '_id', // target in 'user' (linked with user on 'series')
              as: 'user', // replacing the user field (was containing user id)
            },
          }, {
 $project: {
 user: {
            password: 0, isAdmin: 0, email: 0, _id: 0,
          } 
} 
},
            // We delete non-relevant info
          ]);
          console.log('antes de query');
          console.log(query);
          query.toArray().then((documents) => {
            // console.log(documents)
            if (err) throw err;
            const series = documents.map(serie => ({
              _id: serie._id,
              user: serie.user[0],
              title: serie.title,
              sinopsis: serie.sinopsis,
              genre: serie.genre,
              year: serie.year,
              chapter: serie.chapter,
              duration: serie.duration,
              age: serie.age,
            }));
            console.log('SERIES');
            console.log(series);
            res.send(series);
          });

          // .catch(err => {
          //     res.status(400).send('Fallo en la consulta con DB, ' + err);
          // });
          client.close();
        });
      } catch (err) {
        res.status(400).send(`Eror en la conexionDB, ${err}`);
      }
    } else {
      res.status(400).send(`El token no es válido o caducado, ${err}`);
    }
  } catch (err) {
    res.status(400).send(`El token no existe, ${err}`);
  }
};


// añadir una serie
seriesController.add = (req, res) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    console.log(token);

    const decoded = jwt.verify(token, 'mysecret');
    console.log(decoded._id);
    if (decoded) {
      Mongo.MongoClient.connect(mongoUrl, (err, client) => {
        assert.equal(null, err);
        console.log('Connected successfully to server');
        const add = req.body;
        // add.duration += ' minutos';
        // add.age = 'Mayores de ' + add.age + ' años'
        console.log(add);
        const db = client.db(mongoDBName);
        idUser = Mongo.ObjectID(decoded._id);
        const serie = {
          ...({ user: idUser }),
          ...(add.title != '' && { title: add.title }),
          ...(add.sinopsis != '' && { sinopsis: add.sinopsis }),
          ...(add.genre != '' && { genre: add.genre }),
          ...(add.year != '' && { year: add.year }),
          ...(add.chapter != '' && { chapter: add.chapter }),
          ...(add.duration != '' && { duration: add.duration }),
          ...(add.age != '' && { age: add.age }),
        };

        db.collection('series').insertOne(serie,
        ).then(
          res.send('Añadido'),
        ).catch((err) => {
          res.status(400).send(`Fallo en la consulta con DB, ${err}`);
        });
        client.close();
      });
    } else {
      res.status(400).send('El token no es válido o caducado,');
    }
  } catch (error) {
    res.status(400).send(`El token no existe, ${err}`);
  }
};

// editar una serie
seriesController.edit = (req, res) => {
  try {
    console.log('EDIT');
    const token = req.headers.authorization.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'mysecret');
    const idS = Mongo.ObjectID(req.params.idS);
    const idU = Mongo.ObjectID(req.params.idU);
    console.log(idS);
    console.log(decoded._id);
    if (decoded._id == idU || decoded.isAdmin) {

      Mongo.MongoClient.connect(mongoUrl, (err, client) => {
        assert.equal(null, err);
        console.log('Connected successfully to server');
        const update = req.body;
        console.log(update);
        // const idUser = decoded.username; No hace falta hacerlo
        const db = client.db(mongoDBName);
        db.collection('series').updateOne({ _id: idS }, {
          $set: {
            // ...({ user: idUser }),// este campo no se cambia
            ...(update.title != '' && { title: update.title }),
            ...(update.sinopsis != '' && { sinopsis: update.sinopsis }),
            ...(update.genre != '' && { genre: update.genre }),
            ...(update.year != '' && { year: parseInt(update.year) }),
            ...(update.chapter != '' && { chapter: parseInt(update.chapter) }),
            ...(update.duration != '' && { duration: parseInt(update.duration) }),
            ...(update.age != '' && { age: parseInt(update.age) }),

            // ...(update.duration != "" && { duration: parseInt(update.duration) + " minutos" }),
            // ...(update.age != "" && { age: "Mayores de " + parseInt(update.age) + " años" }),
          },
        },
        ).then(
          res.send('Editado'),
        ).catch((err) => {
          res.status(400).send(`Fallo en la consulta con DB, ${err}`);
        });
        client.close();
      });
    } else {
      res.status(400).send('No tienes permisos para editar');
    }
  } catch (error) {
    res.status(400).send(`El token no existe, ${ err}`);
  }
};
// Borrar una serie por el Admin
seriesController.delete = (req, res) => {
  console.log('DELETE');
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'mysecret');

    console.log(decoded._id);
    if (decoded.isAdmin) {
      const id = Mongo.ObjectID(req.params.id);
      console.log(id);
      Mongo.MongoClient.connect(mongoUrl, (err, client) => {
        assert.equal(null, err);
        console.log('Connected successfully to server');

        const db = client.db(mongoDBName);
        db.collection('series').remove({ _id: id })
          .then(
            console.log(id),
            res.send('Borrado'),
          ).catch((err) => {
            res.status(400).send(`Fallo en la consulta con DB, ${ err}`);
          });
        client.close();
      });
    } else {
      res.status(400).send('No tienes permisos para editar, solo puede el Admin.');
    }
  } catch (error) {
    res.status(400).send(`El token no existe, ${err}`);
  }
};

module.exports = seriesController;
