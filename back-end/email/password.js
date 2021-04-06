const ejs = require('ejs')

module.exports = async (user, token) => {
  return await ejs.renderFile('./email/password.ejs', {
      user: user,
      token: token
    })
}