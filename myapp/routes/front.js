/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();


router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login' });
});

router.get('/users', (req, res, next) => {
  res.render('users', { title: 'ListUsers' });
});

router.get('/users/add', (req, res, next) => {
  res.render('addUser', { title: 'AddUser' });
});

router.get('/users/edit/:id', (req, res, next) => {
  res.render('editUser', { title: 'EditUser' });
});


router.get('/series', (req, res, next) => {
  res.render('seriestable', { title: 'ListSeries' });
});
router.get('/series/add', (req, res, next) => {
  res.render('addSerie', { title: 'AddSerie' });
});

router.get('/series/:idU', (req, res, next) => {
  res.render('seriesUser', { title: 'ListSeriesUser' });
});

// router.get('/series/:id', function(req, res, next) {
//   res.render('seriestable', { title: 'ListSeries' });
// });

router.get('/series/edit/:idS/:idU', (req, res, next) => {
  res.render('editSerie', { title: 'EditSerie' });
});


module.exports = router;
