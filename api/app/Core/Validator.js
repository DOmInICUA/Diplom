class Validator {
    constructor (models) {
        this.__models = models;
    }

    validate(v, type, options) {
        if(type && !this['__' + type](v)) {
            return false;
        }
        let checkPass = true;
        if(options.check && options.check.length > 0) {
            options.check.map(check => {
                if(!this[check](v)) {
                    checkPass = false;
                }
            });
        }
        if(!checkPass) {
            return false;
        }
        if(options.length) {
            if(options.length.min && !this.min(v, options.length.min)) {
                return false;
            }
            if(options.length.max && !this.max(v, options.length.max)) {
                return false;
            }
        }
        return true;
    }

    __string(v) {
        return typeof v === 'string';
    }

    __bool(v) {
        return typeof v === 'boolean';
    }

    __number(v) {
        return typeof v === 'number';
    }

    __object(v) {
        return typeof v === 'object';
    }

    __array(v) {
        return this.__object(v) && v.isArray();
    }

    __null(v) {
        return v === null;
    }

    __undefined(v) {
        return v === undefined;
    }

    isEmail(v) {
        if(!v) {
            return true;
        }
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(v);
    }

    isPhone(v) {
        if(!v) {
            return true;
        }
        const pattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/
        return pattern.test(v);
    }

    notEmpty(v) {
        return !!v;
    }

    notEmptyArray(v) {
        return this.__array(v) && v.length > 0;
    }

    notNull(v) {
        return !this.__null(v);
    }

    max(v, max)
    {
        if(!v) {
            return true;
        }
        return (this.__string(v) ? v.length <= max : v <= max);
    }

    min(v, min)
    {
        if(!v) {
            return true;
        }
        return (this.__string(v) ? v.length >= min : v >= min);
    }
}

module.exports = Validator;