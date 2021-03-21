const db = require('./db')
const User = require('./User')

const Token = db.connection.define('tokens', {
	token: {
		type: db.Sequelize.STRING,
		allowNull: false
	}
})

Token.belongsTo(User)

Token.sync({
	force: false
})


module.exports = Token;