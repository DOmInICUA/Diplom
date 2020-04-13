const User = require(process.env.ROOT_DIR + 'app/models/User');
const bcrypt = require("bcryptjs");

module.exports = (ep, db, getModel, checker) => {
    let userResource = ep.resource({
        model: getModel(User, db),
        endpoints: ['/users', '/user/:id'],
        search: [
            {
                param: 'role',
                operator: '$eq',
                attributes: [ 'role' ]
            },
            {
                param: 'emailVerified',
                operator: '$eq',
                attributes: [ 'email' ]
            },
            {
                param: 'name',
                operator: '$eq',
                attributes: [ 'name' ]
            }
        ]
    });

    userResource.create.auth(checker.admin);
    userResource.update.auth(checker.admin);
    userResource.delete.auth(checker.admin);
    userResource.create.write.before((req, res, context) => {
        req.body.password = bcrypt.hashSync(`bcrypt$${req.body.password}`, bcrypt.genSaltSync());
        return context.continue;
    });
    userResource.update.write.before((req, res, context) => {
        if(req.body.password) {
            req.body.password = bcrypt.hashSync(`bcrypt$${req.body.password}`, bcrypt.genSaltSync());
        }
        return context.continue;
    });
}