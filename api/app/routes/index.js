module.exports = (db) => {
  let router = require('express').Router();

  router.get('/', function(req, res, next) {
      res.status(200).json({message: 'OK'});
      next();
  });

  db.models.then(models => {
      router.use('/auth', require('./user/auth')(models));
      router.use('/api', require('./api')(models));
      router.use('/media', require('./media')(models));
  });

  return router;
}