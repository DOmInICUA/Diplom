module.exports = (db) => {
    let router = require('express').Router();

    router.get('/:name', (req, res, next) => {
        res.setHeader("Cache-Control", "private");
        res
        .status(200)
        .sendFile(process.env.ROOT_DIR + "/media/" + req.params.name);
        return;
    });

    return router;
  }