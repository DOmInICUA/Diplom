const Validator = require(process.env.APP + '/Core/Validator');
const User = require(process.env.APP + '/models/User');

class UserValidator extends Validator {
    async checkIsUser(v) {
        if(typeof v === 'object') {
            return v instanceof User;
        } else if(typeof v ==="number") {
            return await this.getUser(v);
        } else {
            return false;
        }
    }

    async getUser(id) {
        return this.__models.User.findOne({where: {id: id}}).then(user => {
            return user;
        })
    }
}

module.exports = UserValidator;