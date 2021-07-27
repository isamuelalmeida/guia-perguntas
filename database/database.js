const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas', 'root', '1234', {
	host: '10.32.128.14',
	dialect: 'mysql'
});

module.exports = connection;