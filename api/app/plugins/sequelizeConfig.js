let Sequelize = require('sequelize');
const Op = Sequelize.Op;
const operatorsAliases = {
  $is: Op.substring,
  $eq: Op.eq
}
let sequelize = new Sequelize(
    'mysql://' + process.env.MYSQL_LOGIN + ':' + process.env.MYSQL_PASS + '@' + process.env.MYSQL_HOST + ':3306/' + process.env.MYSQL_DB, {
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: true
        },
        operatorsAliases
    }
);

module.exports = sequelize;