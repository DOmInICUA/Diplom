const User = require(process.env.ROOT_DIR + "/app/models/User");

module.exports = db => {
  return function(req, res, next) {
    let token = req.header("user-token");
    if (token) {
      db.models.then(models => {
        models.User.findOne({ where: { token: token } }).then(user => {
          req.currentUser = user;
          next();
        });
      });
    } else {
      req.currentUser = null;
      next();
    }
  };
};
