class Controller {
    constructor(models, role, Validator) {
        this.__role = role ? role : '';
        this.__security = require(process.env.APP + '/plugins/security')(models);
        this.__models = models;
        this.validator = Validator ? new Validator(models) : null;
    }

    getModels() {
        return this.__models;
    }

    setModels(models) {
        this.__models = models;
        return this;
    }

    checkRole(req, role) {
        if(!role && !this.__role) {
            return true;
        }
        return this.__security.checkRole(req, (role ? role : this.__role));
    }

    validate(arr) {
        let passed = true;
        arr.map(item => {
            if(!this.validator.validate(item.val, item.type, item.options)) {
                passed = false;
            }
        });
        return passed;
    }
}

module.exports = Controller;