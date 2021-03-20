const db = require('./db')
const User = require('./User')

const TokenVerify = db.connection.define('tokensverifys', {
	token: {
		type: db.Sequelize.STRING,
		allowNull: false
	}
})

TokenVerify.belongsTo(User)

TokenVerify.sync({
	force: false
})


module.exports = TokenVerify;