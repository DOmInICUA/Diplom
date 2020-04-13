const vErr = require('sequelize').ValidationError;
const ForbiddenError = require('epilogue').Errors.ForbiddenError;
const glob  = require("glob");
const path = require("path");

const getEpModel = (model, db) => {
    db.seq.ValidationError = vErr;
    model.sequelize = db.seq;
    model.find = model.findOne;
    if (typeof model.associate === "function") {
        model.associate(db.models);
    }
    if (typeof model.registerHooks === "function") {
        model.registerHooks();
    }
    return model;
};

module.exports = (epilogue, db) => {
    let resources = {};
    let arr = [];
    glob.sync( process.env.ROOT_DIR + 'app/generators/**/*.js' ).forEach( function( file ) {
        arr.push({
            file: file.replace(/^.*[\\\/]/, 'n').split('.')[0],
            path: path.resolve( file )
        });
    });
    arr.map(item => {
        resources[item.file] = item.path;
    });
    db.models.then(models => {
        const dbready = {
            seq: db.seq,
            models: models
        };
        const security = require("./../plugins/security")(models);

        for(let res in resources) {
            resources[res] = require(resources[res]);
            if(typeof resources[res] === 'function') {
                resources[res](epilogue, dbready, getEpModel, {
                    admin: (req, res, context) => {
                        if(security.checkRole(req, 'admin')) {
                            return context.continue;
                        } else {
                            return context.error(new ForbiddenError());
                        }
                    },
                    manager: (req, res, context) => {
                        if(security.checkRole(req, 'manager')) {
                            return context.continue;
                        } else {
                            return context.error(new ForbiddenError());
                        }
                    },
                    user: (req, res, context) => {
                        if(security.checkRole(req, 'user')) {
                            return context.continue;
                        } else {
                            return context.error(new ForbiddenError());
                        }
                    },
                    any: (req, res, context) => {
                        if(security.checkRole(req, '')) {
                            return context.continue;
                        } else {
                            return context.error(new ForbiddenError());
                        }
                    }
                });
            }
        }
    });
}