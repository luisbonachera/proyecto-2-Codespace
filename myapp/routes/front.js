var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
  });

  router.get('/users', function(req, res, next) {
    res.render('users', { title: 'ListUsers' });
  });

  router.get('/users/add', function(req, res, next) {
    res.render('addUser', { title: 'AddUser' });
  });

  router.get('/users/edit/:id', function(req, res, next) {
    res.render('editUser', { title: 'EditUser' });
  });

  
  
  router.get('/series', function(req, res, next) {
    res.render('seriestable', { title: 'ListSeries' });
  });
  router.get('/series/add', function(req, res, next) {
    res.render('addSerie', { title: 'AddSerie' });
  });

  router.get('/series/:idU', function(req, res, next) {
    res.render('seriesUser', { title: 'ListSeriesUser' });
  });

  // router.get('/series/:id', function(req, res, next) {
  //   res.render('seriestable', { title: 'ListSeries' });
  // });
 
  router.get('/series/edit/:idS/:idU', function(req, res, next) {
    res.render('editSerie', { title: 'EditSerie' });
  });

 
module.exports = router;