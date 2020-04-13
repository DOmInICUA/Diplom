const bcrypt = require("bcryptjs");
let sequelize = require("sequelize");

module.exports = class User extends sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        name: {
          required: true,
          type: DataTypes.STRING,
          field: "name"
        },
        email: {
          required: true,
          unique: true,
          lowercase: true,
          type: DataTypes.STRING,
          validate: { isEmail: true },
          field: "email"
        },
        phone: {
          required: false,
          type: DataTypes.STRING,
          validate: { isNumeric: true },
          field: "phone"
        },
        birthday: {
          required: true,
          type: DataTypes.DATE,
          validate: { isDate: true },
          field: "birthday"
        },
        password: {
          type: DataTypes.STRING,
          validate: { min: 6, notEmpty: true },
          field: "password"
        },
        role: {
          type: DataTypes.STRING,
          field: "role"
        },
        token: {
          lowercase: true,
          type: DataTypes.STRING,
          field: "token"
        }
      },
      {
        tableName: "users",
        sequelize
      }
    );
  }
  static associate (models) {}
  static registerHooks() {
    this.beforeCreate(async (user) => {
      if (user.changed("password") && user.password) {
        if (user.password.substr(0, 7) === "bcrypt$") {
          throw new Error("Do not bcrypt passwords before setting them");
        }
        return bcrypt.genSalt(10, function(err, salt) {
          return bcrypt.hash(`bcrypt$${user.password}`, salt, function(err, hash) {
            user.dataValues.password = hash;
            return true;
          });
        });
      }
    });

    return this;
  }
  static newToken() {
    return require("crypto")
      .randomBytes(64)
      .toString("hex");
  }
  validPassword(password) {
    console.log(this.dataValues.password);
    return bcrypt.compareSync(`bcrypt$${password}`, this.dataValues.password);
  }
  toJSON() {
    let values = Object.assign({}, this.get());
    delete values.password;
    return values;
  }
}
