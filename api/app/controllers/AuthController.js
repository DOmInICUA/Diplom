const Controller = require(process.env.APP + '/Core/Controller');
const moment = require('moment');

class AuthController extends Controller {
    async login(req, res) {
        let data = req.body.user;
        if(!this.validate([
            {
                val: data.password,
                type: 'string',
                options: {
                    check: ['notEmpty'],
                    length: {min: 8, max: 40}
                }
            },
            {
                val: data.email,
                type: 'string',
                options: {
                    check: ['isEmail', 'notEmpty'],
                    length: {min: 6, max: 40}
                }
            }
        ])) {
            res.status(400).send({message: 'Invalid data'});
            return false;
        }
        this.__models.User.findOne({where: {
            email: data.email
        }}).then(async user => {
            if(user && user.validPassword(data.password)) {
                user.token = this.__models.User.newToken();
                await user.save();
                res.send({
                    token: user.token,
                    user: {
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        birthday: user.birthday
                    }
                });
            } else res.status(401).send({message: "Invalid password"});
        }).catch(err => {
            res.status(404).send({message: "User not found"});
        });

        return false;
    };

    async logout (req, res) {
        req.currentUser.token = '';
        await req.currentUser.save();
        res.send({status: 'Logout success'});
        return false;
    };

    async info (req, res) {
        res.send({user: {
            name: req.currentUser.name,
            email: req.currentUser.email,
            phone: req.currentUser.phone,
            birthday: req.currentUser.birthday
        }});
        return false;
    };

    async register (req, res) {
        let data = req.body.user;
        if(!this.validate([
            {
                val: data.firstName,
                type: 'string',
                options: {
                    check: ['notEmpty'],
                    length: {max: 40}
                }
            },
            {
                val: data.secondName,
                type: 'string',
                options: {
                    check: ['notEmpty'],
                    length: {max: 40}
                }
            },
            {
                val: data.password,
                type: 'string',
                options: {
                    check: ['notEmpty'],
                    length: {min: 8, max: 40}
                }
            },
            {
                val: data.email,
                type: 'string',
                options: {
                    check: ['isEmail', 'notEmpty'],
                    length: {min: 6, max: 40}
                }
            },
            {
                val: data.phone,
                type: 'string',
                options: {
                    check: ['isPhone', 'notEmpty'],
                    length: {min: 4, max: 40}
                }
            },
            {
                val: data.birthday,
                type: 'string',
                options: {
                    check: [],
                    length: {min: 8, max: 40}
                }
            }
        ])) {
            res.status(400).send({message: 'Invalid data'});
            return false;
        }

        this.__models.User.create({
            name: data.firstName + ' ' + data.secondName,
            password: data.password,
            email: data.email,
            phone: data.phone,
            role: "user",
            token: this.__models.User.newToken(),
            birthday: moment(data.birthday, 'YYYY-MM-DD').toDate()
        }).then(async user => {
            res.send({
                token: user.token,
                user: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    birthday: user.birthday,
                }
            });
        });
        return false;
    };
}

module.exports = AuthController;