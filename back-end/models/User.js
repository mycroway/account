const db = require('./db')


const User = db.connection.define('users', {
  name: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  gender: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: db.Sequelize.STRING,
    defaultValue: 'user'
  },
  blocked: {
    type: db.Sequelize.BOOLEAN,
    defaultValue: false
  },
  emailChecked: {
    type: db.Sequelize.BOOLEAN,
    defaultValue: false
  },
  token: {
    type: db.Sequelize.STRING,
    allowNull: true
  }
})


User.sync({
  force: false
})


module.exports = User;