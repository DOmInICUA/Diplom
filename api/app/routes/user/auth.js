const AuthController = require(process.env.APP + '/controllers/AuthController');
const UserValidator = require(process.env.APP + '/Validators/UserValidator');

module.exports = (models) => {
    let authController = new AuthController(models, '', UserValidator);
    let router = require('express').Router();

    router.post('/login', function(req, res, next) {
        if(authController.checkRole(req)) {
            authController.login(req, res).then((doLast) => {
                if(doLast) {
                    next();
                };
            });
        } else {
            res.status(401).send({message: 'Wrong data'});
        }
    });

    router.get('/logout', function(req, res, next) {
        if(authController.checkRole(req, 'user')) {
            authController.logout(req, res).then((doLast) => {
                if(doLast) {
                    next();
                };
            });
        } else {
            res.status(401).send({message: 'No user authorized'});
        }
    });

    router.get('/info', function(req, res, next) {
        if(authController.checkRole(req, 'user')) {
            authController.info(req, res).then((doLast) => {
                if(doLast) {
                    next();
                };
            });
        } else {
            res.status(401).send({message: 'No user authorized'});
        }
      });

    router.post('/register', function(req, res, next) {
        if(authController.checkRole(req)) {
            authController.register(req, res).then((doLast) => {
                if(doLast) {
                    next();
                };
            });
        } else {
            res.status(401).send({message: 'Wrong data'});
        }
    });

    return router;
  }